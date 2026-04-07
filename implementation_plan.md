# 탱글성형외과 세부 콘텐츠 페이지 구축 실행 계획서 (Implementation Plan)

## 📌 목표 (Objective)
기구축된 **구조화된 추출 데이터(홈페이지 추출본 + 유튜브 요약본 JSON)**만을 활용하여 탱글성형외과 웹사이트의 하위 세부 페이지(Procedures Subpages)를 아주 상세하고 전문적인 수준으로 구축합니다. 오창현 원장님의 유튜브 자료를 적절히 배치하여 잠재 고객의 신뢰도를 극대화하는 프리미엄 웹진 형태의 레이아웃을 제공합니다.

## 🏗 페이지 아키텍처 (Page Architecture)
Next.js App Router의 Dynamic Routing을 사용하여 폴더(카테고리) 및 개별 수술 데이터를 기반으로 페이지를 자동 생성합니다.

*   `app/procedures/page.tsx` : 전체 진료 과목(카테고리) 안내 허브
*   `app/procedures/[category]/page.tsx` : 특정 카테고리(예: 가슴거상, 동안성형) 안내 및 관련 수술 목록
*   `app/procedures/[category]/[slug]/page.tsx` : 상세 수술 단위 페이지 (가장 깊이 있는 콘텐츠)

---

## ⏱ 단계별 작업 계획 (Work Breakdown - 10분 단위)

### [Phase 1: 데이터 레이어 및 라우팅 기반 구축]
*   **Task 1: 데이터 로더(Data Loader) 유틸리티 작성 (10분)**
    *   `src/lib/dataFetcher.ts` 생성
    *   서버 사이드에서 `02_processed_data/structured_data` 내부의 모든 JSON 폴더와 파일을 순회하여 카테고리별로 매핑하는 Type-safe 유틸리티 함수 구현.
*   **Task 2: 라우팅 구조 및 템플릿 레이아웃 세팅 (10분)**
    *   `app/procedures/layout.tsx` 구성 (세부 페이지 전용 프리미엄 LNB - Local Navigation Bar 추가)
    *   데이터의 카테고리(폴더명)를 추출하여 LNB 메뉴에 자동 반영.

### [Phase 3: UI 디자인 시스템 및 컴포넌트 설계]
*   **Task 3: 세부 페이지 공통 UI 컴포넌트 개발 (10분)**
    *   `ProcedureHero` (타이틀, 타겟 고객, 핵심 요약 배너 컴포넌트)
    *   `InfoGrid` (수술 시간, 회복 기간 등의 메타데이터를 표기하는 프리미엄 그리드)
*   **Task 4: 리치 텍스트 및 아코디언 컴포넌트 (10분)**
    *   `SpecialPointCard` (수술 방법론, 장점, 특징 등을 예쁘게 렌더링)
    *   `QnaAccordion` (유튜브 Q&A 데이터를 FAQ 형태로 출력하는 상호작용형 컴포넌트)
*   **Task 5: 미디어 (유튜브) 연동 컴포넌트 구축 (10분)**
    *   `RelatedMediaSection` 생성
    *   JSON의 `video_id`를 기반으로 iframe 영상 또는 썸네일을 띄우고, 하단에 유튜브 스크립트 요약을 노출합니다.

### [Phase 4: 동적 페이지 (Dynamic Pages) 조립 및 연동]
*   **Task 6: 카테고리 뷰 페이지 조립 (`[category]/page.tsx`) (10분)**
    *   해당 폴더 내의 모든 JSON 파일을 썸네일/요약 카드로 나열하는 카테고리별 랜딩 페이지 구현.
*   **Task 7: 디테일 뷰 페이지 조립 (`[category]/[slug]/page.tsx`) (10분)**
    *   각 JSON 파일의 `surgery_info`, `advantages`, `content`, `qa_pairs`, `video_id` 필드를 앞서 만든 모듈식 UI 컴포넌트에 주입.
    *   페이지 길이를 고려한 Sticky 목차(TOC) 구성.

### [Phase 5: 콘텐츠 최적화 및 메인 트래픽 분산]
*   **Task 8: SEO (검색엔진 최적화) 데이터 주입 (10분)**
    *   `generateMetadata`를 사용하여 JSON 데이터의 `title`과 `summary`를 Next.js Meta Tag로 자동 삽입.
*   **Task 9: 메인 페이지 및 기타 연동 (`app/page.tsx`) (10분)**
    *   메인 뷰의 시각적 컴포넌트들을 실제 구축된 `/procedures/...` 링크 경로로 연결.
    *   전체 애플리케이션 빌드 및 구동 안정성 테스트.

---

## 💡 주요 개발 원칙 (Core Principles)
1.  **Single Source of Truth**: 모든 콘텐츠 정보는 오로지 추출된 `structured_data` 내부의 JSON에서만 가져옵니다. 프론트엔드 단에 임의의 하드코딩 텍스트를 배제합니다.
2.  **Premium Aesthetic**: 탱글만의 독자적인 프리미엄 컨셉을 유지하기 위해 다크 테마/글래스모피즘 베이스 및 현대적인 타이포그래피(Inter, 프리텐다드 등)를 적용합니다.
3.  **Media-First**: 오창현 원장님의 전문적인 유튜브 정보의 가치가 높으므로, 핵심 Q&A와 유튜브 영상을 페이지의 하이라이트 영역에 전략적으로 배치합니다.
