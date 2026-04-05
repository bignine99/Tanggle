"""
STEP 2: 자막 추출기 (하이브리드 방식)
각 영상에 대해:
  1차) youtube-transcript-api 로 한국어 자막 추출 시도
  2차) 실패 시 yt-dlp + OpenAI Whisper API 로 전사

- 실행: python 02_transcript_extractor.py [--sample N] [--force-whisper]
- 출력: ../01_raw_data/raw_transcripts/{video_id}.json
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from tqdm import tqdm

# ─── 경로 설정 ────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
RAW_DATA_DIR = ROOT_DIR / "01_raw_data"
TRANSCRIPT_DIR = RAW_DATA_DIR / "raw_transcripts"
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR = ROOT_DIR / "05_reports"

load_dotenv(SCRIPT_DIR / ".env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ─── 의료 전문용어 보정 사전 (Whisper 오인식 대응) ────────────
MEDICAL_CORRECTIONS = {
    "복부거산": "복부거상",
    "가슴거산": "가슴거상",
    "허벅지거산": "허벅지거상",
    "지방흡입": "지방흡입",
    "여유증": "여유증",
    "복직근이개": "복직근이개",
    "마스토펙시": "가슴거상",
    "압복": "복압",
    "탱글성형": "탱글성형외과",
}


# ═══════════════════════════════════════════════════════════════
#  방법 A: YouTube Transcript API
# ═══════════════════════════════════════════════════════════════
def extract_via_youtube_api(video_id: str) -> list[dict] | None:
    """
    youtube-transcript-api 로 한국어 자막 추출.
    반환: [{text, start, duration}, ...] 또는 None (실패 시)
    """
    try:
        from youtube_transcript_api import (
            NoTranscriptFound,
            TranscriptsDisabled,
            YouTubeTranscriptApi,
        )

        # 1. 사용 가능한 자막 목록 확인
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # 2. 한국어 자막 우선 탐색 (수동 생성 > 자동 생성)
        transcript = None
        method_detail = ""

        try:
            transcript = transcript_list.find_manually_created_transcript(["ko"])
            method_detail = "manual_ko"
        except Exception:
            pass

        if transcript is None:
            try:
                transcript = transcript_list.find_generated_transcript(["ko"])
                method_detail = "auto_ko"
            except Exception:
                pass

        if transcript is None:
            return None

        # 3. 자막 데이터 가져오기
        fetched = transcript.fetch()
        segments = []
        for item in fetched:
            segments.append({
                "text": item.get("text", "").strip(),
                "start": round(item.get("start", 0), 2),
                "duration": round(item.get("duration", 0), 2),
            })

        return segments if segments else None

    except Exception:
        return None


# ═══════════════════════════════════════════════════════════════
#  방법 B: yt-dlp 오디오 추출 + OpenAI Whisper API
# ═══════════════════════════════════════════════════════════════
def extract_via_whisper(video_id: str, tmp_dir: Path) -> list[dict] | None:
    """
    yt-dlp로 오디오 추출 후 OpenAI Whisper API로 전사.
    반환: [{text, start, duration}, ...] 또는 None
    """
    if not OPENAI_API_KEY:
        print(f"     ⚠️  OPENAI_API_KEY 미설정 - Whisper 건너뜀 ({video_id})")
        return None

    video_url = f"https://www.youtube.com/watch?v={video_id}"
    audio_path = tmp_dir / f"{video_id}.mp3"

    try:
        # 1. 오디오 다운로드 (최저 품질 mp3, 최대 25MB 제한 고려)
        cmd_download = [
            "yt-dlp",
            "-x",                           # 오디오 추출
            "--audio-format", "mp3",
            "--audio-quality", "5",         # 낮은 품질 (파일 크기 절약)
            "--no-playlist",
            "-o", str(audio_path),
            "--quiet",
            video_url,
        ]
        result = subprocess.run(cmd_download, capture_output=True, timeout=300)
        if result.returncode != 0 or not audio_path.exists():
            return None

        # 2. 파일 크기 확인 (Whisper API 25MB 제한)
        file_size_mb = audio_path.stat().st_size / (1024 * 1024)
        if file_size_mb > 24:
            print(f"     ⚠️  파일 크기 초과 ({file_size_mb:.1f}MB) - 분할 처리 필요")
            # TODO: 분할 처리 로직 추가 (pydub)
            return None

        # 3. OpenAI Whisper API 전사
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)

        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="ko",              # 한국어 강제 지정
                response_format="verbose_json",  # 타임스탬프 포함
                timestamp_granularities=["segment"],
            )

        # 4. 결과 파싱
        segments = []
        for seg in response.segments:
            segments.append({
                "text": seg.text.strip(),
                "start": round(seg.start, 2),
                "duration": round(seg.end - seg.start, 2),
            })

        return segments if segments else None

    except Exception as e:
        print(f"     ❌ Whisper 오류 ({video_id}): {e}")
        return None
    finally:
        # 임시 파일 정리
        if audio_path.exists():
            audio_path.unlink()


# ═══════════════════════════════════════════════════════════════
#  텍스트 후처리
# ═══════════════════════════════════════════════════════════════
def apply_medical_corrections(text: str) -> str:
    """의료 전문용어 자동 보정"""
    for wrong, correct in MEDICAL_CORRECTIONS.items():
        text = text.replace(wrong, correct)
    return text


def segments_to_full_text(segments: list[dict]) -> str:
    """세그먼트 리스트 → 연속 텍스트 (타임스탬프 없이)"""
    texts = [s["text"] for s in segments if s.get("text")]
    return " ".join(texts)


# ═══════════════════════════════════════════════════════════════
#  단일 영상 처리
# ═══════════════════════════════════════════════════════════════
def process_video(video: dict, force_whisper: bool = False) -> dict:
    """
    단일 영상에 대해 자막 추출 시도.
    반환: 처리 결과 dict (저장용)
    """
    video_id = video["video_id"]
    output_path = TRANSCRIPT_DIR / f"{video_id}.json"

    # 이미 처리된 파일 스킵
    if output_path.exists() and not force_whisper:
        return {"video_id": video_id, "status": "skipped_exists"}

    result = {
        "video_id": video_id,
        "title": video.get("title", ""),
        "duration_seconds": video.get("duration_seconds", 0),
        "upload_date": video.get("upload_date", ""),
        "category": video.get("category", "기타"),
        "is_shorts": video.get("is_shorts", False),
        "youtube_url": video.get("url", f"https://www.youtube.com/watch?v={video_id}"),
        "extraction": {
            "method": None,       # "youtube_api" or "whisper" or "failed"
            "timestamp": None,
            "success": False,
        },
        "segments": [],
        "full_text": "",
        "char_count": 0,
    }

    # ── 1차: YouTube API ──────────────────────────────────────
    if not force_whisper:
        segments = extract_via_youtube_api(video_id)
        if segments:
            # 의료용어 보정
            for seg in segments:
                seg["text"] = apply_medical_corrections(seg["text"])
            result["segments"] = segments
            result["full_text"] = segments_to_full_text(segments)
            result["char_count"] = len(result["full_text"])
            result["extraction"]["method"] = "youtube_api"
            result["extraction"]["success"] = True
            result["extraction"]["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%S")

    # ── 2차: Whisper API (YouTube API 실패 시) ────────────────
    if not result["extraction"]["success"]:
        tmp_dir = SCRIPT_DIR / "_tmp_audio"
        tmp_dir.mkdir(exist_ok=True)

        segments = extract_via_whisper(video_id, tmp_dir)
        if segments:
            for seg in segments:
                seg["text"] = apply_medical_corrections(seg["text"])
            result["segments"] = segments
            result["full_text"] = segments_to_full_text(segments)
            result["char_count"] = len(result["full_text"])
            result["extraction"]["method"] = "whisper"
            result["extraction"]["success"] = True
            result["extraction"]["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%S")

    # ── 실패 처리 ─────────────────────────────────────────────
    if not result["extraction"]["success"]:
        result["extraction"]["method"] = "failed"
        result["extraction"]["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%S")

    # 저장
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result


# ═══════════════════════════════════════════════════════════════
#  메인 실행
# ═══════════════════════════════════════════════════════════════
def main():
    parser = argparse.ArgumentParser(description="탱글 유튜브 자막 추출기")
    parser.add_argument("--sample", type=int, default=0,
                        help="샘플 모드: 처음 N개만 처리 (0=전체)")
    parser.add_argument("--force-whisper", action="store_true",
                        help="YouTube API 건너뛰고 Whisper만 사용")
    parser.add_argument("--shorts", action="store_true",
                        help="쇼츠도 포함 (기본: 제외)")
    parser.add_argument("--category", type=str, default="",
                        help="특정 카테고리만 처리 (예: 복부거상)")
    args = parser.parse_args()

    # 메타데이터 로드
    metadata_path = RAW_DATA_DIR / "channel_metadata.json"
    if not metadata_path.exists():
        print("❌ channel_metadata.json 없음. 먼저 01_channel_crawler.py를 실행하세요.")
        sys.exit(1)

    with open(metadata_path, encoding="utf-8") as f:
        data = json.load(f)

    videos = data["videos"]

    # 필터링
    if not args.shorts:
        videos = [v for v in videos if not v.get("is_shorts", False)]
    if args.category:
        videos = [v for v in videos if v.get("category") == args.category]
    if args.sample > 0:
        videos = videos[:args.sample]

    print("=" * 60)
    print("  탱글 자막 추출기 v1.0 (하이브리드)")
    print("=" * 60)
    print(f"  처리 대상: {len(videos)}개 영상")
    print(f"  쇼츠 포함: {args.shorts}")
    print(f"  Whisper 강제: {args.force_whisper}")
    if args.sample:
        print(f"  샘플 모드: 처음 {args.sample}개")
    print()

    # 통계 추적
    stats = {"youtube_api": 0, "whisper": 0, "failed": 0, "skipped": 0}
    total_chars = 0

    # 배치 처리
    for video in tqdm(videos, desc="자막 추출", unit="영상"):
        result = process_video(video, force_whisper=args.force_whisper)
        method = result.get("extraction", {}).get("method", "failed")

        if result.get("status") == "skipped_exists":
            stats["skipped"] += 1
        elif method == "youtube_api":
            stats["youtube_api"] += 1
            total_chars += result.get("char_count", 0)
        elif method == "whisper":
            stats["whisper"] += 1
            total_chars += result.get("char_count", 0)
        else:
            stats["failed"] += 1

        # API 요청 간격 (레이트 리밋 방지)
        time.sleep(0.5)

    # 결과 출력
    print("\n" + "=" * 60)
    print("  ✅ 추출 완료!")
    print("=" * 60)
    print(f"  YouTube API 성공: {stats['youtube_api']}개")
    print(f"  Whisper API 성공: {stats['whisper']}개")
    print(f"  실패             : {stats['failed']}개")
    print(f"  스킵(기존)       : {stats['skipped']}개")
    print(f"  총 추출 텍스트   : {total_chars:,}자")
    print(f"  저장 위치        : {TRANSCRIPT_DIR}")
    print("=" * 60)

    # 보고서 저장
    REPORT_DIR.mkdir(exist_ok=True)
    report_path = REPORT_DIR / "extraction_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "total_processed": len(videos),
            "stats": stats,
            "total_chars": total_chars,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n  📊 보고서 저장: {report_path}")


if __name__ == "__main__":
    main()
