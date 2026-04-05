"""
STEP 1: 채널 크롤러
탱글 유튜브 채널(@Tanggle_Tube)의 모든 영상 메타데이터를 수집합니다.
- 실행: python 01_channel_crawler.py
- 출력: ../01_raw_data/channel_metadata.json
"""

import json
import subprocess
import sys
import os
from datetime import datetime
from pathlib import Path

# Windows 터미널 유니코드 인코딩 오류 방지
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# ─── 경로 설정 ────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
RAW_DATA_DIR = ROOT_DIR / "01_raw_data"
RAW_DATA_DIR.mkdir(exist_ok=True)

# youtube 채널 홈 탭 전체 (일반영상 + Shorts 모두 포함)
CHANNEL_URL = "https://www.youtube.com/@Tanggle_Tube"
OUTPUT_FILE = RAW_DATA_DIR / "channel_metadata.json"
REPORT_FILE = ROOT_DIR / "05_reports" / "crawl_report.txt"


def check_yt_dlp():
    """yt-dlp 설치 확인"""
    try:
        result = subprocess.run([sys.executable, "-m", "yt_dlp", "--version"], capture_output=True, text=True)
        print(f"✅ yt-dlp 버전: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ yt-dlp가 설치되지 않았습니다.")
        print("   설치 명령어: pip install yt-dlp")
        return False


def crawl_channel(channel_url: str) -> list[dict]:
    """
    yt-dlp --flat-playlist 를 사용해 채널 전체 영상 메타데이터 수집.
    API 키 없이 무료로 동작합니다.
    """
    print(f"\n🔍 채널 크롤링 시작: {channel_url}")
    print("   (영상 수에 따라 1~5분 소요될 수 있습니다...)\n")

    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--flat-playlist",          # 메타데이터만 수집 (다운로드 없음)
        "--dump-json",              # JSON 형식 출력
        "--no-warnings",
        "--quiet",
        channel_url
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")

    if result.returncode != 0:
        print(f"❌ 크롤링 오류:\n{result.stderr}")
        sys.exit(1)

    videos = []
    for line in result.stdout.strip().split("\n"):
        if not line.strip():
            continue
        try:
            data = json.loads(line)
            video = {
                "video_id": data.get("id", ""),
                "title": data.get("title", ""),
                "url": data.get("url", f"https://www.youtube.com/watch?v={data.get('id', '')}"),
                "duration_seconds": data.get("duration", 0),
                "duration_string": data.get("duration_string", ""),
                "upload_date": data.get("upload_date", ""),
                "view_count": data.get("view_count", 0),
                "like_count": data.get("like_count", 0),
                "description": data.get("description", ""),
                "tags": data.get("tags", []),
                "is_shorts": _detect_shorts(data),
                "channel_id": data.get("channel_id", ""),
                "thumbnail": data.get("thumbnail", ""),
                # 처리 상태 추적
                "_status": {
                    "transcript_extracted": False,
                    "transcript_method": None,   # "youtube_api" or "whisper"
                    "cleaned": False,
                    "structured": False,
                    "embedded": False,
                },
            }
            videos.append(video)
        except json.JSONDecodeError:
            continue

    return videos


def _detect_shorts(data: dict) -> bool:
    """YouTube Shorts 여부 감지"""
    duration = data.get("duration", 0) or 0
    url = data.get("url", "") or ""
    title = data.get("title", "") or ""

    if "shorts" in url.lower():
        return True
    if duration > 0 and duration <= 60:
        return True
    if "#shorts" in title.lower():
        return True
    return False


def categorize_video(title: str) -> str:
    """제목 기반 카테고리 자동 분류"""
    title_lower = title.lower()
    categories = {
        "복부거상": ["복부거상", "배거상", "tummy tuck", "복부", "뱃살", "복직근"],
        "가슴거상": ["가슴거상", "가슴", "유방", "mastopexy", "breast"],
        "팔거상": ["팔거상", "팔", "upper arm", "이두"],
        "허벅지거상": ["허벅지거상", "허벅지", "thigh"],
        "엉덩이성형": ["엉덩이", "힙업", "힙라인", "hip", "buttock"],
        "남성여유증": ["여유증", "남성", "gynecomastia"],
        "지방흡입": ["지방흡입", "liposuction", "지방"],
        "바디필러": ["바디필러", "바디보톡스", "필러"],
        "쇼츠": [],    # is_shorts=True로 처리
        "기타": [],
    }

    for category, keywords in categories.items():
        if any(kw in title_lower or kw in title for kw in keywords):
            return category
    return "기타"


def main():
    print("=" * 60)
    print("  탱글성형외과 채널 크롤러 v1.0")
    print("=" * 60)

    if not check_yt_dlp():
        sys.exit(1)

    # 크롤링 실행
    videos = crawl_channel(CHANNEL_URL)

    if not videos:
        print("❌ 영상을 찾지 못했습니다.")
        sys.exit(1)

    # 카테고리 추가
    for video in videos:
        if video["is_shorts"]:
            video["category"] = "쇼츠"
        else:
            video["category"] = categorize_video(video["title"])

    # 통계 계산
    total = len(videos)
    shorts_count = sum(1 for v in videos if v["is_shorts"])
    longform_count = total - shorts_count
    categories = {}
    for v in videos:
        cat = v["category"]
        categories[cat] = categories.get(cat, 0) + 1

    # 결과 저장
    output = {
        "crawled_at": datetime.now().isoformat(),
        "channel_url": CHANNEL_URL,
        "statistics": {
            "total_videos": total,
            "longform_videos": longform_count,
            "shorts_videos": shorts_count,
            "by_category": categories,
        },
        "videos": videos,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # 보고서 출력
    print("\n" + "=" * 60)
    print(f"  ✅ 수집 완료!")
    print("=" * 60)
    print(f"  📊 총 영상 수      : {total}개")
    print(f"  📹 롱폼 영상       : {longform_count}개")
    print(f"  ▶  쇼츠           : {shorts_count}개")
    print(f"\n  📂 카테고리별 분포:")
    for cat, cnt in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"     {cat:15s}: {cnt}개")
    print(f"\n  💾 저장 위치: {OUTPUT_FILE}")
    print("=" * 60)

    # 보고서 파일 저장
    REPORT_FILE.parent.mkdir(exist_ok=True)
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(f"크롤링 시각: {datetime.now().isoformat()}\n")
        f.write(f"총 영상 수: {total}\n")
        f.write(f"롱폼: {longform_count} / 쇼츠: {shorts_count}\n\n")
        f.write("카테고리별:\n")
        for cat, cnt in sorted(categories.items(), key=lambda x: -x[1]):
            f.write(f"  {cat}: {cnt}개\n")

    return output


if __name__ == "__main__":
    main()
