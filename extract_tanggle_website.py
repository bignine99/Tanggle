import os
import re
import json
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import google.generativeai as genai
import tempfile

# 환경 변수 로드
load_dotenv('04_scripts/.env')
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    load_dotenv('04_scripts/.env.example')
    API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

# 콘텐츠가 없는(비시술) 페이지 건너뛰기
SKIP_PREFIXES = [
    'common_', 'community_', 'counsel_',
]

# 멀티모달 프롬프트
PROMPT = """
당신은 성형외과 웹페이지 이미지 구조화 및 텍스트 데이터 추출 전문가입니다.
첨부된 이미지들은 탱글성형외과의 특정 시술/병원정보에 대한 전체 웹페이지 콘텐츠(세로로 이어진 이미지들)입니다.

이 이미지들에 담긴 모든 텍스트, 설명, 정보, 의사 이력, 특장점, 시술 요약, 회복 기간, 수술 방법 등을 빠짐없이 추출하여 깨끗한 JSON 형식으로 정리해주세요.
형식은 엄격한 JSON이어야 하며, 불필요한 마크다운 백틱 없이 출력하세요.

JSON 구조 예시:
{
  "category": "시술/분류카테고리명",
  "procedure_name": "시술명 혹은 페이지 제목",
  "summary": "핵심 내용 요약",
  "surgery_info": { "surgery_time": "...", "anesthesia": "...", "hospitalization": "...", "stitch_removal": "...", "recovery_time": "..." },
  "advantages": ["장점1", "장점2"],
  "details": { ... 추가 정보 ... },
  "doctor_info": { ... 의사 관련 정보 및 학회 이력 등 ... }
}
"""

DOMAIN = "https://www.tanggleps.com"
URLS_FILE = "urls.txt"
OUTPUT_DIR = r"02_processed_data\structured_data\홈페이지추출"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def should_skip(url_path):
    fname = url_path.split('/')[-1]
    for prefix in SKIP_PREFIXES:
        if fname.startswith(prefix):
            return True
    return False

def get_already_done():
    done = set()
    if os.path.exists(OUTPUT_DIR):
        for f in os.listdir(OUTPUT_DIR):
            if f.endswith('.json'):
                done.add(f.replace('.json', '.php'))
    return done

def process_url(url_path):
    print(f"\n[{url_path}] download & analyze...")
    full_url = DOMAIN + url_path
    try:
        resp = requests.get(full_url, timeout=15)
        resp.encoding = 'utf-8'
        html = resp.text
    except Exception as e:
        print(f"HTTP error: {e}")
        return

    soup = BeautifulSoup(html, 'html.parser')
    
    # 전체 페이지에서 이미지를 찾되, 다양한 패턴에 대응
    img_urls = []
    
    # 콘텐츠 영역 탐색 (여러 가지 시도)
    content_area = (
        soup.find('div', id='contents_wrap') or
        soup.find('div', class_='mc_title_wrap') or
        soup.find('div', id='contents') or
        soup.find('body')
    )
    
    if not content_area:
        print("skip (no content area found)")
        return
        
    for img in content_area.find_all('img'):
        src = img.get('src', '')
        if not src:
            continue
        # 아이콘, 네비, 공통 이미지 제외
        if any(skip in src.lower() for skip in ['icon', 'logo', 'arrow', 'btn_', 'close', 'blank', 'transparent', '.gif', 'slick', 'sns_']):
            continue
        # 콘텐츠 이미지 필터
        if '/images/' in src or '/files/' in src:
            if src.startswith('../'):
                clean_src = '/' + src[3:]
            elif src.startswith('//'):
                clean_src = 'https:' + src
            elif not src.startswith('http'):
                if not src.startswith('/'):
                    clean_src = '/' + src
                else:
                    clean_src = src
            else:
                clean_src = src
            
            if clean_src.startswith('/'):
                img_urls.append(DOMAIN + clean_src)
            else:
                img_urls.append(clean_src)
            
    # 중복 제거 (순서유지)
    img_urls = list(dict.fromkeys(img_urls))
    print(f"found {len(img_urls)} images")
    if not img_urls:
         print("skip (no valid content images).")
         return

    # 이미지 다운로드
    downloaded_files = []
    temp_dir = tempfile.mkdtemp()
    
    for idx, i_url in enumerate(img_urls):
        try:
            r = requests.get(i_url, timeout=10)
            if r.status_code == 200 and len(r.content) > 500:  # 크기가 너무 작은 이미지 제외
                ext = i_url.split('.')[-1].split('?')[0]
                if ext not in ['jpg', 'png', 'jpeg', 'webp']:
                    ext = 'jpg'
                file_path = os.path.join(temp_dir, f"img_{idx}.{ext}")
                with open(file_path, 'wb') as f:
                    f.write(r.content)
                downloaded_files.append(file_path)
        except Exception as e:
            print(f"image download failed: {i_url} - {e}")

    if not downloaded_files:
        print("skip (no images downloaded)")
        return
        
    # Gemini에 업로드
    uploaded_genai_files = []
    for fpath in downloaded_files:
        try:
            f = genai.upload_file(fpath)
            uploaded_genai_files.append(f)
        except Exception as e:
             print(f"upload error: {e}")
             
    if not uploaded_genai_files:
        print("skip (no files uploaded)")
        return
             
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        content_parts = uploaded_genai_files + [PROMPT]
        
        response = model.generate_content(
            content_parts,
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"}
        )
        
        result_json = response.text
        
        # 저장
        fname = url_path.split('/')[-1].replace('.php', '.json')
        output_path = os.path.join(OUTPUT_DIR, fname)
        with open(output_path, 'w', encoding='utf-8') as jsf:
            jsf.write(result_json)
        print(f"[OK] {output_path} saved!")
        
    except Exception as e:
        print(f"Gemini extraction failed: {e}")
    finally:
        # cleanup
        for uf in uploaded_genai_files:
            try:
                genai.delete_file(uf.name)
            except:
                pass
        for fpath in downloaded_files:
            try:
                os.remove(fpath)
            except:
                pass

if __name__ == "__main__":
    if not os.path.exists(URLS_FILE):
        print(f"{URLS_FILE} not found.")
    else:
        with open(URLS_FILE, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        already_done = get_already_done()
        total = len(urls)
        
        for idx, u in enumerate(urls, 1):
            if not u.startswith('/htm/'):
                continue
            
            # 비콘텐츠 페이지 건너뛰기
            if should_skip(u):
                print(f"--- ({idx}/{total}) --- SKIP (non-content): {u}")
                continue
                
            # 이미 처리된 페이지 건너뛰기
            page_fname = u.split('/')[-1]
            if page_fname in already_done:
                print(f"--- ({idx}/{total}) --- SKIP (already done): {u}")
                continue
                
            print(f"--- ({idx}/{total}) ---")
            process_url(u)
            time.sleep(2) # rate limit delay
            
    print("\nAll processing complete!")
