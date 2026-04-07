# 탱글성형외과 프리미엄 이미지 생성 프롬프트 가이드 (Phase 1)

이 문서는 탱글성형외과 웹사이트의 랜딩 페이지(Hero), 카테고리 카드, 그리고 주요 서브 브랜딩 페이지에 삽입될 **최상급 포토리얼리스틱(Photorealistic)** AI 이미지를 생성하기 위한 프롬프트입니다.

Midjourney(미드저니) 또는 Stable Diffusion, DALL-E 3 등을 활용하여 생성하실 수 있도록 최적화된 영문 프롬프트와 옵션을 제공합니다. 
생성된 이미지는 아래 명시된 **[저장할 파일명]**으로 `c:\Users\cho\Desktop\Temp\05_1_code\260405_Tanggle\01_raw_data\homepage_image` 폴더에 저장해 주시면, 제가 웹사이트 코드에서 이를 매핑하여 최적의 위치에 자동 배치하겠습니다.

---

## 🎨 공통 필수 키워드 (Common Modifiers)
모든 이미지에 기본적으로 우아함과 의료적 신뢰감을 주는 톤앤매너가 유지되어야 합니다.
> **Vibe:** High-end medical aesthetic clinic, clean luxury, pure white and beige tone, flawless but highly realistic skin texture, modern minimalism.
> **Lighting:** Soft studio lighting, natural window daylight, premium editorial photography, 8k resolution, photorealistic, shot on 85mm lens, shallow depth of field.

---

## 1. 메인 홈페이지 히어로(Hero) 배경 이미지
홈페이지 접속 시 가장 먼저 보이는, 프리미엄 맞춤 컨설팅을 상징하는 거대한 배경 이미지입니다. (어두운 오버레이가 깔릴 예정이므로 피사체는 밝고 화사하게 우측/좌측으로 치우친 것이 좋습니다.)

* **저장할 파일명:** `hero_main_consult.jpg`
* **비율 및 권장 해상도:** 16:9 (가로형) / 1920x1080 이상
* **프롬프트:**
  ```text
  A hyper-realistic editorial photography of a beautiful and elegant Korean female model in her 20s, side profile, clear glowing flawless skin, soft natural makeup. She is resting her chin gracefully on her elegant hands, looking softly at the camera. Minimalist pure white and beige clinical background. Soft morning sunlight filtering through a sheer curtain, creating a gentle and warm atmosphere. High-end luxury cosmetics commercial style, ultra-detailed, 8k, photorealistic, shot on 85mm lens f/1.8 --ar 16:9 --style raw --v 6.0
  ```

## 2. 시술 카테고리 대표 이미지 (가로형/정방형 카드용)
각 시술 카테고리('시술 전체 카테고리' 그리드)를 대표하는 모델의 부위별 강조 이미지입니다.

### 2-1. 눈성형 (Eye Surgery)
* **저장할 파일명:** `category_eye.jpg`
* **비율 및 권장 해상도:** 4:3 또는 1:1 / 800x800 이상
* **프롬프트:**
  ```text
  Close-up portrait of a breathtakingly beautiful Korean woman. Focus on her deep, clear, and perfectly shaped eyes with elegant double eyelids. Natural and clean eyebrows. She is looking straight into the lens with a confident and soft gaze. Flawless skin texture, bright white background with a hint of warm beige, softbox lighting, extremely detailed eyelashes, luxury beauty editorial, incredibly realistic --ar 4:3 --v 6.0
  ```

### 2-2. 코성형 (Nose Surgery)
* **저장할 파일명:** `category_nose.jpg`
* **비율 및 권장 해상도:** 4:3 또는 1:1
* **프롬프트:**
  ```text
  Side profile close-up portrait of an elegant Korean female model, highlighting her perfectly proportioned, beautiful nose bridge and elegant sideline. Soft, flawless glowing skin. Minimalist aesthetic, luxury aesthetic clinic concept, elegant neck line, soft airy lighting, clean pale beige background, 8k, photorealistic, premium editorial --ar 4:3 --v 6.0
  ```

### 2-3. 리프팅 & 안티에이징 (Lifting & Anti-aging)
* **저장할 파일명:** `category_lifting.jpg`
* **비율 및 권장 해상도:** 4:3 또는 1:1
* **프롬프트:**
  ```text
  Close-up portrait of an elegant and sophisticated Korean woman in her late 30s with incredibly tight, smooth, and elastic skin. Gentle hands softly touching her sharp and perfectly contoured jawline (V-line). High-end anti-aging skincare commercial, radiant skin, soft natural smile, warm and pure white background, luxurious studio lighting, 8k, photorealistic --ar 4:3 --v 6.0
  ```

### 2-4. 가슴 & 체형 (Breast & Body Contouring)
* **저장할 파일명:** `category_body.jpg`
* **비율 및 권장 해상도:** 4:3 또는 1:1
* **프롬프트:**
  ```text
  A tasteful, artistic, and highly elegant mid-shot of a beautiful Korean female model wearing a soft silk white slip dress. Focus on elegant collarbones and beautifully contoured body lines. Graceful posture. The mood is highly refined and luxurious, not inappropriate. Clean, high-end medical clinic aesthetic, soft bright lighting, blurred bright background, Vogue editorial photography style, photorealistic --ar 4:3 --v 6.0
  ```

### 2-5. 기타/쁘띠 시술 (Petite & Skin)
* **저장할 파일명:** `category_petite.jpg`
* **비율 및 권장 해상도:** 4:3 또는 1:1
* **프롬프트:**
  ```text
  Extreme close-up of a flawless, glass-like beautiful Korean female skin. Symmetrical face, full hydrated lips, absolute perfection. Crystal clear bright morning aesthetic. Dewy makeup, fresh and modern vibe. Luxury dermatological clinic commercial, soft diffuse lighting, white aesthetic, ultra-sharp detail, 8k --ar 4:3 --v 6.0
  ```

## 3. 병원 인테리어 공간 이미지 (의원소개 배경)
의원소개(Clinic) 페이지의 배경 및 삽화로 사용될 럭셔리 라운지 인테리어 이미지입니다.

* **저장할 파일명:** `hero_clinic_interior.jpg`
* **비율 및 권장 해상도:** 16:9
* **프롬프트:**
  ```text
  Interior design of a high-end luxury aesthetic clinic lounge. Modern minimalist architecture, curved walls, pure white and soft warm beige color palette, marble textures, indirect warm LED lighting. Elegant modern beige sofa in the center. Impeccably clean and sterile but highly welcoming and luxurious. Architectural photography, photorealistic, 8k, cinematic lighting --ar 16:9 --v 6.0
  ```

## 4. 커뮤니티 & 고객 응대 라운지 이미지 (커뮤니티 배경)
환자가 모바일로 후기를 찾거나 친절하게 상담을 진행하는 느낌의 감성적 이미지입니다.

* **저장할 파일명:** `hero_community.jpg`
* **비율 및 권장 해상도:** 16:9
* **프롬프트:**
  ```text
  A beautiful elegant Korean woman sitting in a highly luxurious modern white lounge of a high-end clinic, smiling warmly while elegantly looking at her modern smartphone. Bright, airy, sunlight illuminating the room. Soft, welcoming, and highly trustworthy atmosphere. Flawless skin, elegant white blouse, interior architectural photography, high-end commercial style, photorealistic --ar 16:9 --v 6.0
  ```

---

### 📂 작업 프로세스 안내
1. 위 프롬프트를 사용하여 4배수로 이미지를 생성해주세요.
2. 가장 마음에 드는 이미지를 1장씩 선정하여 위 명시된 파일명으로 변경한 뒤 `01_raw_data\homepage_image` 폴더에 업로드해주세요. 
3. 파일 업로드가 모두 완료되었다고 말씀해 주시면, 제가 `05_website_frontend\public\images` 폴더로 이를 복사하고, UI 렌더링 방식 전면 교체(Hover Action, Glassmorphism, Fade in 등 UI 팝업 효과 포함) 작업을 진행하겠습니다!
