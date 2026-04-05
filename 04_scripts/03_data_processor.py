import json
import os
import sys
import glob
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv
import google.generativeai as genai

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
RAW_DIR = ROOT_DIR / "01_raw_data" / "raw_transcripts"
PROCESSED_DIR = ROOT_DIR / "02_processed_data" / "structured_data"

# .env 로드 및 API 키 확인
load_dotenv(ROOT_DIR / "04_scripts" / ".env")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY를 찾을 수 없습니다. .env 파일을 확인하세요.")
    sys.exit(1)

genai.configure(api_key=api_key)

# 모델 설정
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-lite",
    generation_config={
        "temperature": 0.2,
        "response_mime_type": "application/json",
    }
)

PROMPT_TEMPLATE_LONG = """
다음은 '탱글성형외과' 유튜브 영상의 전체 텍스트입니다.
불필요한 인사말, 구독/좋아요 유도 멘트, 잡음을 제외하고 실제 유용한 정보만을 바탕으로 분석하여 JSON 형식으로 출력해주세요.

출력 JSON 스키마:
{
  "summary": "영상의 핵심 내용을 2~3문장으로 요약",
  "key_topics": ["핵심 주제1", "핵심 주제2", "핵심 주제3"],
  "procedures_mentioned": ["언급된 수술명1", "수술명2"],
  "target_audience": "이 영상을 추천하는 대상",
  "qa_pairs": [
    {"question": "예상되는 질문1", "answer": "영상 내용 기반 답변1"}
  ],
  "cleaned_transcript": "불필요한 멘트가 제거된 핵심 본문 원본 텍스트"
}

[중요 규칙]
1. 원장의 이름은 무조건 "오창현 대표원장"으로 표기할 것 (오상현 등 오탈자 금지).

입력 텍스트:
{transcript}
"""

PROMPT_TEMPLATE_SHORTS = """
다음은 '탱글성형외과' 유튜브 쇼츠(Shorts) 영상의 텍스트입니다.
짧은 영상이므로 의학적 깊이보다 '홍보성, 마케팅 포인트, 병원의 특장점, 유머러스한 어필'에 집중하여 분석하세요.

출력 JSON 스키마:
{
  "summary": "쇼츠 텍스트가 시사하는 마케팅 요약 1~2문장",
  "key_topics": ["홍보 포인트1", "어필 키워드2"],
  "procedures_mentioned": ["언급된 수술/시술명"],
  "target_audience": "관심을 가질 타겟층 (예: 결혼식을 앞둔 예비 신부)",
  "qa_pairs": [
    {"question": "이 쇼츠를 본 환자가 궁금해할 질문", "answer": "세일즈 포인트를 섞은 답변"}
  ],
  "cleaned_transcript": "쇼츠 텍스트 (광고성 멘트도 살릴 것)"
}

[중요 규칙]
1. 원장의 이름은 무조건 "오창현 대표원장"으로 표기할 것.

입력 텍스트:
{transcript}
"""

def process_transcript(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            return False

    # 원본 텍스트가 없는 경우 스킵
    if not data.get("full_text") or len(data.get("full_text", "")) < 30:
        return False

    category = data.get("category", "기타")
    out_dir = PROCESSED_DIR / category
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{data['video_id']}.json"

    # 이미 처리된 파일이면 무시
    if out_file.exists():
        return True

    if category == "쇼츠":
        prompt = PROMPT_TEMPLATE_SHORTS.replace("{transcript}", data["full_text"])
    else:
        prompt = PROMPT_TEMPLATE_LONG.replace("{transcript}", data["full_text"])
    
    try:
        response = model.generate_content(prompt)
        structured_content = json.loads(response.text)
        
        # 원본 데이터와 병합
        final_data = {
            "video_id": data["video_id"],
            "metadata": {
                "title": data["title"],
                "duration_seconds": data.get("duration_seconds", 0),
                "category": category,
                "youtube_url": data.get("youtube_url", "")
            },
            "content": structured_content
        }
        
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
            
        return True
    except Exception as e:
        print(f"\n❌ 오류 발생 [{data['video_id']}]: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("  탱글성형외과 데이터 정제 및 구조화 모듈 (Phase 1-4 & 1-5)")
    print("=" * 60)
    
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    files = glob.glob(str(RAW_DIR / "*.json"))
    
    if not files:
        print("⚠️ 처리할 원시 자막 데이터가 없습니다.")
        return

    successful = 0
    failed = 0
    
    for f_path in tqdm(files, desc="데이터 구조화 및 정제"):
        if process_transcript(f_path):
            successful += 1
        else:
            failed += 1
            
    print("=" * 60)
    print(f"  ✅ 작업 완료!")
    print(f"  - 성공: {successful}건")
    print(f"  - 실패/스킵: {failed}건")
    print(f"  📂 저장 위치: {PROCESSED_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
