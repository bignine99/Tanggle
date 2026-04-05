"""
STEP 2 (Gemini 특화 무료-초저가 하이브리드): 자막 추출기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
전략:
  1차) youtube-transcript-api  → YouTube 자동자막 무료 추출 (무료/빠름)
  2차) yt-dlp + Google Gemini 1.5 Flash API → 오디오 파일 업로드 후 최고화질 전사
        - 장점: 월 일정사용량 이내 무료 제공. 아주 빠르고 정확.
        - 모델: gemini-1.5-flash

실행 전 준비:
  1. pip install -r requirements.txt (혹은 google-generativeai 등)
  2. .env 파일에 GEMINI_API_KEY 입력 

실행:
  python 02_transcript_extractor_gemini.py
  python 02_transcript_extractor_gemini.py --sample 5
  python 02_transcript_extractor_gemini.py --category 복부거상

출력:
  ../01_raw_data/raw_transcripts/{video_id}.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

# Windows 터미널 유니코드 인코딩 오류 방지
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
from tqdm import tqdm

try:
    import google.generativeai as genai
except ImportError:
    print("❌ google-generativeai 모듈이 설치되지 않았습니다. pip install google-generativeai 를 실행하세요.")
    sys.exit(1)

# ─── 경로 ─────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
RAW_DATA_DIR = ROOT_DIR / "01_raw_data"
TRANSCRIPT_DIR = RAW_DATA_DIR / "raw_transcripts"
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
TMP_AUDIO_DIR = SCRIPT_DIR / "_tmp_audio"
REPORT_DIR = ROOT_DIR / "05_reports"

# ─── 환경 변수 로드 ───────────────────────────────────────────
load_dotenv(SCRIPT_DIR / ".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ─── 의료 전문용어 사전 ───────────────────────────────────────
MEDICAL_CORRECTIONS = {
    "복부거산": "복부거상",
    "가슴거산": "가슴거상",
    "허벅지거산": "허벅지거상",
    "팔거산": "팔거상",
    "탱글성형": "탱글성형외과",
    "복직근이개": "복직근이개",
    "마스트펙시": "가슴거상",
}


# ═══════════════════════════════════════════════════════════════
#  방법 A: YouTube Transcript API (자막 있는 경우 사용, 무료)
# ═══════════════════════════════════════════════════════════════
def extract_youtube_transcript(video_id: str) -> tuple[list[dict], str] | tuple[None, None]:
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        transcript = None
        method_detail = ""

        try:
            transcript = transcript_list.find_manually_created_transcript(["ko"])
            method_detail = "manual_ko"
        except:
            pass

        if transcript is None:
            try:
                transcript = transcript_list.find_generated_transcript(["ko"])
                method_detail = "auto_ko"
            except:
                pass

        if transcript is None:
            return None, None

        fetched = transcript.fetch()
        segments = []
        for item in fetched:
            text = item.get("text", "").strip()
            if text:
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
#  방법 B: Gemini 1.5 Flash (자막 없는 경우 사용, 가장 저렴함)
# ═══════════════════════════════════════════════════════════════
def extract_gemini_api(video_id: str) -> tuple[str, str] | tuple[None, None]:
    """
    yt-dlp로 오디오 다운로드 → Gemini File API 업로드 → Prompt로 전사 요청
    반환: (full_text, "gemini_flash")
    """
    if not GEMINI_API_KEY:
        print(f"\n     ⚠️  GEMINI_API_KEY 미설정. Gemini 추출 스킵 ({video_id})")
        return None, None

    video_url = f"https://www.youtube.com/watch?v={video_id}"
    TMP_AUDIO_DIR.mkdir(exist_ok=True)
    audio_path = TMP_AUDIO_DIR / f"{video_id}.mp3"
    
    uploaded_file = None

    try:
        # ── 1. 오디오 다운로드 ────────────────────────────────
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "5",       # 저용량으로 처리
            "--no-playlist",
            "-o", str(audio_path),
            "--quiet",
            "--no-warnings",
            video_url,
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)

        if result.returncode != 0 or not audio_path.exists():
            print(f"\n     ⚠️ 오디오 다운로드 실패 ({video_id})")
            return None, None

        # ── 2. Gemini API로 오디오 업로드 ─────────────────────
        uploaded_file = genai.upload_file(path=str(audio_path))
        
        # 파일이 활성화(프로세싱 완료)될 때까지 대기
        while uploaded_file.state.name == "PROCESSING":
            time.sleep(2)
            uploaded_file = genai.get_file(uploaded_file.name)
            
        if uploaded_file.state.name == "FAILED":
            print(f"\n     ❌ Gemini 오디오 처리 실패 ({video_id})")
            return None, None

        # ── 3. Gemini 전사 프롬프트 요청 ──────────────────────
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        prompt = "오디오의 내용을 한국어로 정확하고 완전하게 스크립트 작성(전사, transcribe)해줘. 내용을 부연 설명하거나 요약하지 말고 오로지 들리는 말(대화) 전부를 그대로 텍스트로 옮겨줘. 문맥상 명확한 의료 전문용어나 성형 수술 관련 단어를 정확히 표기해줘."
        
        response = model.generate_content([uploaded_file, prompt])
        
        text = response.text.strip()
        if text:
            text = apply_corrections(text)
            return text, "gemini_flash"
        
        return None, None

    except Exception as e:
        print(f"\n     ❌ Gemini API 오류 ({video_id}): {e}")
        return None, None
    finally:
        # 업로드된 파일 명시적 삭제
        if uploaded_file:
            try:
                genai.delete_file(uploaded_file.name)
            except Exception:
                pass
        # 로컬 오디오 임시파일 삭제
        if audio_path.exists():
            try:
                audio_path.unlink()
            except Exception:
                pass


# ═══════════════════════════════════════════════════════════════
#  공통 유틸
# ═══════════════════════════════════════════════════════════════
def apply_corrections(text: str) -> str:
    for wrong, correct in MEDICAL_CORRECTIONS.items():
        text = text.replace(wrong, correct)
    return text

def segments_to_fulltext(segments: list[dict]) -> str:
    return " ".join(s["text"] for s in segments if s.get("text"))


# ═══════════════════════════════════════════════════════════════
#  단일 영상 분석 파이프라인
# ═══════════════════════════════════════════════════════════════
def process_video(
    video: dict,
    force_reprocess: bool = False,
) -> dict:
    video_id = video["video_id"]
    out_path = TRANSCRIPT_DIR / f"{video_id}.json"

    if out_path.exists() and not force_reprocess:
        return {"video_id": video_id, "status": "skipped_exists", "char_count": 0}

    result = {
        "video_id": video_id,
        "title": video.get("title", ""),
        "duration_seconds": video.get("duration_seconds", 0),
        "category": video.get("category", "기타"),
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

    # 1. YouTube 자막 추출 (무료/즉시)
    segments, method_detail = extract_youtube_transcript(video_id)

    if segments:
        result["segments"] = segments
        result["full_text"] = segments_to_fulltext(segments)
        result["char_count"] = len(result["full_text"])
        result["extraction"]["method"] = "youtube_api"
        result["extraction"]["method_detail"] = method_detail
        result["extraction"]["success"] = True
    else:
        # 2. 자막이 없으면 Gemini API 비동기 추출 방식을 사용 (저비용/고화질)
        full_text, gemini_detail = extract_gemini_api(video_id)
        if full_text:
            result["full_text"] = full_text
            result["char_count"] = len(full_text)
            result["extraction"]["method"] = "gemini_api"
            result["extraction"]["method_detail"] = gemini_detail
            result["extraction"]["success"] = True

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result


def main():
    parser = argparse.ArgumentParser(description="탱글 자막 추출기 (Gemini 하이브리드)")
    parser.add_argument("--sample", type=int, default=0)
    parser.add_argument("--category", type=str, default="")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    meta_path = RAW_DATA_DIR / "channel_metadata.json"
    if not meta_path.exists():
        print("❌ channel_metadata.json 없음. 01_channel_crawler.py 실행 요망.")
        sys.exit(1)

    with open(meta_path, encoding="utf-8") as f:
        data = json.load(f)

    videos = data["videos"]

    if args.category:
        videos = [v for v in videos if v.get("category") == args.category]
    if args.sample > 0:
        videos = videos[: args.sample]

    print("=" * 60)
    print("  탱글 자막 추출기 (YouTube API + Gemini 1.5 Flash)")
    print("=" * 60)
    
    stats = {
        "youtube_api": 0,
        "gemini_api": 0,
        "failed": 0,
        "skipped": 0,
    }
    total_chars = 0

    for video in tqdm(videos, desc="진행 상태", unit="영상"):
        r = process_video(video, force_reprocess=args.force)

        status = r.get("status", "")
        method = r.get("extraction", {}).get("method", "failed")

        if status == "skipped_exists":
            stats["skipped"] += 1
        elif method == "youtube_api":
            stats["youtube_api"] += 1
            total_chars += r.get("char_count", 0)
        elif method == "gemini_api":
            stats["gemini_api"] += 1
            total_chars += r.get("char_count", 0)
        else:
            stats["failed"] += 1

        time.sleep(0.5)

    print("\n" + "=" * 60)
    print("  ✅ 추출 완료!")
    print(f"  - YouTube API 추출 : {stats['youtube_api']}건 (1차 처리)")
    print(f"  - Gemini API 추출   : {stats['gemini_api']}건 (자막없는 영상)")
    print(f"  - 기존 스킵 처리    : {stats['skipped']}건")
    print(f"  - 실패/오류         : {stats['failed']}건")
    print(f"  - 저장된 전체 글자  : {total_chars:,}자")
    print("=" * 60)


if __name__ == "__main__":
    main()
