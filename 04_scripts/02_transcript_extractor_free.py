"""
STEP 2 (무료 버전): 자막 추출기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
전략:
  1차) youtube-transcript-api  → YouTube 자동자막 무료 추출 (API 키 불필요)
  2차) yt-dlp + faster-whisper → 로컬 STT 무료 전사 (GPU/CPU 모두 가능)

비용: $0 (완전 무료)

실행:
  python 02_transcript_extractor_free.py            # 전체 처리
  python 02_transcript_extractor_free.py --sample 5 # 샘플 5개 테스트
  python 02_transcript_extractor_free.py --category 복부거상
  python 02_transcript_extractor_free.py --whisper-model small  # 속도 우선
  python 02_transcript_extractor_free.py --whisper-model large-v3 # 정확도 우선

출력:
  ../01_raw_data/raw_transcripts/{video_id}.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

from tqdm import tqdm

# ─── 경로 ─────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
RAW_DATA_DIR = ROOT_DIR / "01_raw_data"
TRANSCRIPT_DIR = RAW_DATA_DIR / "raw_transcripts"
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
TMP_AUDIO_DIR = SCRIPT_DIR / "_tmp_audio"
REPORT_DIR = ROOT_DIR / "05_reports"

# ─── 의료 전문용어 보정 사전 ──────────────────────────────────
# Whisper/YouTube ASR 오인식 빈번한 용어 교정
MEDICAL_CORRECTIONS = {
    "복부거산": "복부거상",
    "가슴거산": "가슴거상",
    "허벅지거산": "허벅지거상",
    "팔거산": "팔거상",
    "탱글성형": "탱글성형외과",
    "복직근이개": "복직근이개",
    "지방이식": "지방이식",
    "여유종": "여유증",
    "피하지방": "피하지방",
    "마스트펙시": "가슴거상",
    "함몰유두": "함몰유두",
}


# ═══════════════════════════════════════════════════════════════
#  방법 A: YouTube Transcript API (완전 무료, API 키 불필요)
# ═══════════════════════════════════════════════════════════════
def extract_youtube_transcript(video_id: str) -> tuple[list[dict], str] | tuple[None, None]:
    """
    YouTube 자동생성 자막을 무료로 추출합니다.

    반환: (segments, method_detail) 또는 (None, None)
    - segments: [{text, start, duration}, ...]
    - method_detail: "manual_ko" | "auto_ko" | "auto_ko_translated"
    """
    try:
        from youtube_transcript_api import (
            NoTranscriptFound,
            TranscriptsDisabled,
            YouTubeTranscriptApi,
        )

        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = None
        method_detail = ""

        # 1순위: 수동 작성 한국어 자막
        try:
            transcript = transcript_list.find_manually_created_transcript(["ko"])
            method_detail = "manual_ko"
        except Exception:
            pass

        # 2순위: 자동 생성 한국어 자막
        if transcript is None:
            try:
                transcript = transcript_list.find_generated_transcript(["ko"])
                method_detail = "auto_ko"
            except Exception:
                pass

        if transcript is None:
            return None, None

        fetched = transcript.fetch()
        segments = []
        for item in fetched:
            text = item.get("text", "").strip()
            if text:
                # HTML 태그 제거
                import re
                text = re.sub(r"<[^>]+>", "", text)
                text = apply_corrections(text)
                segments.append({
                    "text": text,
                    "start": round(item.get("start", 0), 2),
                    "duration": round(item.get("duration", 0), 2),
                })

        return (segments, method_detail) if segments else (None, None)

    except Exception:
        return None, None


# ═══════════════════════════════════════════════════════════════
#  방법 B: 로컬 faster-whisper (완전 무료, CPU/GPU 지원)
# ═══════════════════════════════════════════════════════════════
_whisper_model_cache = {}  # 모델 재사용 (매번 로드 방지)


def get_whisper_model(model_size: str):
    """faster-whisper 모델 로드 (캐싱)"""
    if model_size not in _whisper_model_cache:
        try:
            from faster_whisper import WhisperModel
        except ImportError:
            print("\n❌ faster-whisper 미설치. 설치 명령어:")
            print("   pip install faster-whisper")
            return None

        print(f"\n   🔄 Whisper 모델 로딩: {model_size} (최초 1회 다운로드)")
        # device="auto": GPU 있으면 CUDA, 없으면 CPU 자동
        model = WhisperModel(model_size, device="auto", compute_type="int8")
        _whisper_model_cache[model_size] = model
        print(f"   ✅ 모델 로드 완료")

    return _whisper_model_cache[model_size]


def extract_whisper_local(video_id: str, model_size: str = "small") -> tuple[list[dict], str] | tuple[None, None]:
    """
    yt-dlp로 오디오 다운로드 후 로컬 faster-whisper로 전사.

    model_size 선택 가이드:
      tiny   → 매우 빠름, 낮은 정확도 (테스트용)
      small  → 빠름, 충분한 정확도 ★추천 (CPU에서도 실용적)
      medium → 균형 (GPU 권장)
      large-v3 → 최고 정확도 (GPU 필요)

    반환: (segments, "whisper_{model_size}") 또는 (None, None)
    """
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    TMP_AUDIO_DIR.mkdir(exist_ok=True)
    audio_path = TMP_AUDIO_DIR / f"{video_id}.mp3"

    try:
        # ── 1. 오디오 다운로드 ────────────────────────────────
        cmd = [
            "yt-dlp",
            "-x",                        # 오디오만 추출
            "--audio-format", "mp3",
            "--audio-quality", "5",       # 낮은 비트레이트 (파일 크기 절약)
            "--no-playlist",
            "-o", str(audio_path),
            "--quiet",
            "--no-warnings",
            video_url,
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)

        if result.returncode != 0 or not audio_path.exists():
            return None, None

        # ── 2. 로컬 Whisper 전사 ──────────────────────────────
        model = get_whisper_model(model_size)
        if model is None:
            return None, None

        segments_gen, info = model.transcribe(
            str(audio_path),
            language="ko",               # 한국어 고정
            beam_size=5,
            vad_filter=True,             # 음성 구간만 처리 (배경음 필터)
            vad_parameters=dict(min_silence_duration_ms=500),
        )

        segments = []
        for seg in segments_gen:
            text = seg.text.strip()
            if text:
                text = apply_corrections(text)
                segments.append({
                    "text": text,
                    "start": round(seg.start, 2),
                    "duration": round(seg.end - seg.start, 2),
                })

        return (segments, f"whisper_{model_size}") if segments else (None, None)

    except Exception as e:
        print(f"\n     ❌ Whisper 오류 ({video_id}): {e}")
        return None, None
    finally:
        if audio_path.exists():
            audio_path.unlink()


# ═══════════════════════════════════════════════════════════════
#  공통 유틸
# ═══════════════════════════════════════════════════════════════
def apply_corrections(text: str) -> str:
    """의료 전문용어 자동 보정"""
    for wrong, correct in MEDICAL_CORRECTIONS.items():
        text = text.replace(wrong, correct)
    return text


def segments_to_fulltext(segments: list[dict]) -> str:
    """세그먼트 → 전체 텍스트 연결"""
    return " ".join(s["text"] for s in segments if s.get("text"))


# ═══════════════════════════════════════════════════════════════
#  단일 영상 처리
# ═══════════════════════════════════════════════════════════════
def process_video(
    video: dict,
    whisper_model: str = "small",
    skip_whisper: bool = False,
    force_reprocess: bool = False,
) -> dict:
    video_id = video["video_id"]
    out_path = TRANSCRIPT_DIR / f"{video_id}.json"

    # 기존 파일 스킵
    if out_path.exists() and not force_reprocess:
        return {"video_id": video_id, "status": "skipped"}

    result = {
        "video_id": video_id,
        "title": video.get("title", ""),
        "duration_seconds": video.get("duration_seconds", 0),
        "upload_date": video.get("upload_date", ""),
        "category": video.get("category", "기타"),
        "is_shorts": video.get("is_shorts", False),
        "youtube_url": video.get("url", f"https://www.youtube.com/watch?v={video_id}"),
        "extraction": {
            "method": "failed",
            "method_detail": None,
            "success": False,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        },
        "segments": [],
        "full_text": "",
        "char_count": 0,
    }

    # ── 1차: YouTube API (무료, 빠름) ─────────────────────────
    segments, detail = extract_youtube_transcript(video_id)

    if segments:
        result["segments"] = segments
        result["full_text"] = segments_to_fulltext(segments)
        result["char_count"] = len(result["full_text"])
        result["extraction"]["method"] = "youtube_api"
        result["extraction"]["method_detail"] = detail
        result["extraction"]["success"] = True

    # ── 2차: 로컬 Whisper (무료, 시간 소요) ──────────────────
    elif not skip_whisper:
        segments, detail = extract_whisper_local(video_id, whisper_model)
        if segments:
            result["segments"] = segments
            result["full_text"] = segments_to_fulltext(segments)
            result["char_count"] = len(result["full_text"])
            result["extraction"]["method"] = "whisper_local"
            result["extraction"]["method_detail"] = detail
            result["extraction"]["success"] = True

    # 저장
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    result["extraction"]["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    return result


# ═══════════════════════════════════════════════════════════════
#  메인
# ═══════════════════════════════════════════════════════════════
def main():
    parser = argparse.ArgumentParser(
        description="탱글 유튜브 자막 추출기 (완전 무료 버전)"
    )
    parser.add_argument("--sample", type=int, default=0,
                        help="처음 N개만 처리 (0=전체)")
    parser.add_argument("--category", type=str, default="",
                        help="특정 카테고리만 처리 (예: 복부거상)")
    parser.add_argument("--include-shorts", action="store_true",
                        help="쇼츠 포함 (기본: 제외)")
    parser.add_argument("--skip-whisper", action="store_true",
                        help="YouTube API 실패 시 Whisper 건너뜀")
    parser.add_argument("--whisper-model",
                        choices=["tiny", "small", "medium", "large-v3"],
                        default="small",
                        help="Whisper 모델 크기 (기본: small)")
    parser.add_argument("--force", action="store_true",
                        help="이미 처리된 파일도 재처리")
    args = parser.parse_args()

    # ── 메타데이터 로드 ───────────────────────────────────────
    meta_path = RAW_DATA_DIR / "channel_metadata.json"
    if not meta_path.exists():
        print("❌ channel_metadata.json 없음.")
        print("   먼저 실행: python 01_channel_crawler.py")
        sys.exit(1)

    with open(meta_path, encoding="utf-8") as f:
        data = json.load(f)

    videos = data["videos"]

    # ── 필터링 ────────────────────────────────────────────────
    if not args.include_shorts:
        videos = [v for v in videos if not v.get("is_shorts", False)]
    if args.category:
        videos = [v for v in videos if v.get("category") == args.category]
    if args.sample > 0:
        videos = videos[: args.sample]

    print("=" * 60)
    print("  탱글 자막 추출기 v2.0 (완전 무료)")
    print("=" * 60)
    print(f"  처리 대상    : {len(videos)}개 영상")
    print(f"  쇼츠 포함    : {args.include_shorts}")
    print(f"  Whisper 모델 : {args.whisper_model}")
    print(f"  예상 비용    : $0.00 (완전 무료) 🎉")
    if args.sample:
        print(f"  샘플 모드    : 처음 {args.sample}개")
    print()

    # 이미 처리된 파일 수 확인
    existing = len(list(TRANSCRIPT_DIR.glob("*.json")))
    if existing > 0:
        print(f"  ℹ️  기존 처리 파일: {existing}개 (--force 옵션으로 재처리 가능)\n")

    # ── 처리 루프 ─────────────────────────────────────────────
    stats = {
        "youtube_api": 0,
        "whisper_local": 0,
        "failed": 0,
        "skipped": 0,
    }
    total_chars = 0

    for video in tqdm(videos, desc="자막 추출", unit="영상"):
        r = process_video(
            video,
            whisper_model=args.whisper_model,
            skip_whisper=args.skip_whisper,
            force_reprocess=args.force,
        )

        status = r.get("status", "")
        method = r.get("extraction", {}).get("method", "failed")

        if status == "skipped":
            stats["skipped"] += 1
        elif method == "youtube_api":
            stats["youtube_api"] += 1
            total_chars += r.get("char_count", 0)
        elif method == "whisper_local":
            stats["whisper_local"] += 1
            total_chars += r.get("char_count", 0)
        else:
            stats["failed"] += 1

        # 요청 간격 (YouTube 차단 방지)
        time.sleep(0.3)

    # ── 결과 출력 ─────────────────────────────────────────────
    success_total = stats["youtube_api"] + stats["whisper_local"]
    print("\n" + "=" * 60)
    print("  ✅ 추출 완료!")
    print("=" * 60)
    print(f"  YouTube API 성공 : {stats['youtube_api']}개 (무료·즉시)")
    print(f"  로컬 Whisper 성공: {stats['whisper_local']}개 (무료·시간 소요)")
    print(f"  실패             : {stats['failed']}개")
    print(f"  스킵 (기존)      : {stats['skipped']}개")
    print(f"  ─────────────────────────────")
    print(f"  성공률           : {success_total}/{len(videos)-stats['skipped']} "
          f"({success_total/(max(len(videos)-stats['skipped'],1))*100:.1f}%)")
    print(f"  총 추출 텍스트   : {total_chars:,}자")
    print(f"  총 비용          : $0.00 🎉")
    print(f"  저장 위치        : {TRANSCRIPT_DIR}")
    print("=" * 60)

    # 보고서 저장
    REPORT_DIR.mkdir(exist_ok=True)
    import json as _json
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total_videos": len(videos),
        "stats": stats,
        "total_chars": total_chars,
        "total_cost_usd": 0.0,
    }
    report_path = REPORT_DIR / "extraction_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        _json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n  📊 보고서: {report_path}")


if __name__ == "__main__":
    main()
