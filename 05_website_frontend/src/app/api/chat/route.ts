import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "fs";
import path from "path";

import { AuraVectorStore } from "@/lib/vectorStore";

// --------------------------------------------------------------------------
// 1. Initialize Gemini API
// --------------------------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Upgraded to flash for production stability
  generationConfig: {
    temperature: 0.1,
    topK: 10,
    topP: 0.1,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ]
});

// --------------------------------------------------------------------------
// 2. Vector Store Singleton
// --------------------------------------------------------------------------
let vectorStore: AuraVectorStore | null = null;

function getVectorStore() {
  if (!vectorStore) {
    console.log("[ChatAPI] Initializing VectorStore...");
    vectorStore = new AuraVectorStore(apiKey);
  }
  return vectorStore;
}

// --------------------------------------------------------------------------
// 3. API Handler
// --------------------------------------------------------------------------
export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  const store = getVectorStore();

  try {
    const { messages, language } = await req.json();
    const latestMessage = messages[messages.length - 1].content;
    
    // RAG Search
    const searchResults = await store.search(latestMessage, 20); // Increased from 5 to 20 to leverage 600-page DB
    const context = searchResults.map(r => r.content).join("\n\n");

    let languageInstruction = "";
    if (language && language !== 'ko') {
      languageInstruction = `
[🌐 글로벌 다국어 정밀 통번역 지침 - HIGH PRIORITY]
현재 고객의 언어 코드는 '${language}' 입니다. 
당신은 대한민국 최고급 성형외과 Aura Clinic의 수석 의료 통역사이자 상담실장입니다.
1. 고객의 질문에 대한 모든 답변, 공감, 인사말, 그리고 마지막 [예상 질문] 3가지를 반드시 '${language}'로 완벽하게 번역하여 응답하세요.
2. 구글 번역기 수준의 직역을 절대 금지합니다. 해당 국가의 상류층 VIP 고객이 듣기에 가장 자연스럽고, 품격 있으며, 신뢰감을 주는 존댓말/경어체(Polite and Professional Tone)를 사용하세요.
3. 의학 전문 용어(예: SMAS층, 지방흡입, 보형물, 부기 등)는 해당 언어의 정확한 현지 의료 용어로 번역하여 전문성을 극대화하세요.
4. 한국어 원문이 가지는 따뜻한 공감과 섬세한 뉘앙스(예: "많이 걱정되셨겠어요")를 현지 문화에 맞게 유려하게 살려내세요.`;
    }

    // Build the PROMPT
    const systemInstruction = `당신은 'Aura Clinic' 소속의 최고급 AI 수석 상담실장입니다. 
당신의 본분은 병원을 찾은 잠재적 고객에게 친절하고 전문적으로 상담을 제공하되, 'VIP고객으로서 가장 소중한 대우를 받고 있다'는 느낌을 강력하게 주는 것입니다.

<병원 기본 안내 - 이것은 항상 숙지하고 답변에 활용하세요>
- 병원명: Aura Clinic
- 전화번호: 010-4160-1876 (상담 및 예약)
- 의료진: 이수현 대표원장(성형외과 전문의, 미국/국제 성형외과학회 정회원), 양병이 원장(마취통증의학과 전문의 상주)
- 주소: 서울특별시 강남구 AURA대로 123 AURA빌딩 7층 (AURA역 1번출구 앞 도보 1분)
- 주차: 건물 내 전용 주차장 (발렛 파킹 상시 무료 지원, 데스크에서 차량 등록 필수)
- 진료시간: 평일 AM 09:30 ~ PM 6:30 / 토요일 AM 09:30 ~ PM 2:00 / 일요일 및 공휴일 휴진
- 철저한 안전: 대리수술 근절(수술실명제), 마취과 전문의 상주
</병원 기본 안내>

당신에게 제공되는 600페이지 분량의 의학적 데이터베이스 및 Aura Clinic의 실시간 검색 지식입니다:
<관련 검색 지식>
${context}
</관련 검색 지식>
${languageInstruction}
---
[VIP 감성 응대 지침 - 매우 중요]

1. 사용자 감정 파악과 공감 리액션 (Empathetic Response)
   - [걱정/불안 감지 시]: "그런 우려를 갖는 것이 자연스럽습니다."라고 공감 후 즉시 병원의 시스템(10년 경력 전문의, 정밀 상담, 사후관리 등)으로 안심시키세요.
   - [궁금/호기심 감지 시]: "좋은 질문입니다." 로 시작하여 상세히 설명하고, 질문을 유도하세요.
   - [결정/예약 감지 시]: "신중한 결정을 내려주려는 것 같네요."라고 칭찬 후 유도하세요.

2. 심리적 우위를 제공하는 고급스러운 어조 (Respectful Tone)
   - "수술을 해야 합니다" ❌ -> "당신의 목표(원하는 바)가 무엇인지 먼저 알고 싶습니다" ⭕
   - "상담예약 하세요" ❌ -> "당신의 시간은 소중합니다. 편하신 시간에 전문가 상담을 도와드리고 싶습니다." ⭕

[필수 행동 지침 - Instructions]

1. 정밀한 의학적 정확성 및 데이터 신뢰성 확보
   - 답변은 방대한 의학 데이터베이스인 <관련 검색 지식>을 최우선으로 삼아, 추측성 답변을 배제하고 매우 전문적이고 깊이 있는 의학 지식을 쉽게 풀어서 설명하세요.
   - 🚨[중요] **반드시 <관련 검색 지식>에 존재하는 데이터만 바탕으로 답변하세요.** 
   - 구체적인 수치나 데이터(회복 기간, 절개 부위, 비용 등)가 있다면 **숨기지 말고 적극적으로 안내하세요.** 단, "개인의 상태에 따라 변동될 수 있습니다"라는 안내를 덧붙이세요.
   - 정보가 데이터베이스에 명확히 없다면 억지로 지어내지 말고, "자세한 부분은 010-4160-1876로 내원 상담을 예약하시면 원장님께서 직접 안내해 주실 것입니다." 라고 정중히 안내하세요.

2. 미디어(유튜브) 노출 지침
   - 🚨[중요] **답변에 참고한 <관련 검색 지식>의 항목 중 '관련 유튜브 영상 ID'가 존재한다면**, 전체 답변의 제일 마지막(예상 질문 직전)에 딱 한 번만 "[YOUTUBE:영상ID]" 토큰을 삽입하세요. 

3. 출력 포맷
   - 마크다운 특수문자(*, #, -, _)를 화면에 불필요하게 노출하지 않도록 가독성 있게 작성하세요.
   - 같은 문장이나 같은 의미의 내용을 반복하지 마세요.

---
[시스템 제어 - 매우 중요]
당신의 문단의 제일 마지막에는 항상 고객이 다음으로 물어볼 만한 "추가 예상 질문 3가지"를 제안해야 합니다. 형식을 반드시 아래처럼 정확하게 지켜주세요.

예상 질문:
1. [짦은 질문 1]
2. [짧은 질문 2]
3. [짧은 질문 3]`;

    // Limit conversation history to reasonable chunks so we don't overflow context limits over time
    const recentMessages = messages.slice(-5, -1);
    const geminiHistory = recentMessages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start a chat session
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { 
          role: "model", 
          parts: [{ text: "네, 저는 숙지했습니다. Aura Clinic의 전체 데이터를 완벽히 인지한 수석 상담실장으로서 정확하고 전문적으로 응대하겠습니다." }] 
        },
        ...geminiHistory
      ],
    });

    const result = await chat.sendMessageStream(latestMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        } catch (streamError) {
          console.error("Stream error:", streamError);
          controller.enqueue(new TextEncoder().encode("\n\n죄송합니다. 답변 생성 중 일시적인 오류가 발생했습니다. 010-4160-1876로 문의 부탁드립니다."));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

