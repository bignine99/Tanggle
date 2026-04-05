import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 0.1, // Prevent hallucinations and repetitive loops
    topK: 10,
    topP: 0.1,
  }
});

// Path to the processed structured data
const dataPath = path.join(process.cwd(), "..", "02_processed_data", "structured_data");

// Utility to read all JSON files recursively
function getAllJsonFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith(".json")) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    // 1. Simple Keyword Extractor to find relevant JSON files
    // (In a real system, use embeddings. Here we do simple heuristics)
    const allFiles = getAllJsonFiles(dataPath);
    
    // We will build a small "Knowledge context"
    let relevantContext = "";
    let matchCount = 0;

    for (const file of allFiles) {
      if (matchCount >= 3) break; // Limit context size
      
      const content = fs.readFileSync(file, 'utf-8');
      const data = JSON.parse(content);
      
      let title = data.metadata?.title || data.procedure_name || data.category || "기능 정보";
      let summary = data.content?.summary || data.summary || "";
      let keyTopics = Array.isArray(data.content?.key_topics) ? data.content.key_topics.join(" ") : "";
      let advantages = Array.isArray(data.advantages) ? data.advantages.join(" ") : JSON.stringify(data.advantages || "");
      let surgeryInfo = data.surgery_info ? JSON.stringify(data.surgery_info) : "";
      
      const searchSpace = `${title} ${summary} ${keyTopics} ${advantages} ${surgeryInfo} ${JSON.stringify(data)}`.toLowerCase();
      
      // Checking if any word in the user's message matches the topics
      const keywords = latestMessage.split(" ").filter((k: string) => k.length > 1);
      const isMatch = keywords.some((k: string) => searchSpace.includes(k.toLowerCase()));
      
      if (isMatch || keywords.length === 0) {
        relevantContext += `[참고자료: ${title}]\n요약: ${summary}\n`;
        
        // Handle YouTube Q&A
        if (data.content?.qa_pairs) {
          relevantContext += "관련 Q&A:\n";
          data.content.qa_pairs.forEach((qa: any) => {
            relevantContext += `Q: ${qa.question}\nA: ${qa.answer}\n`;
          });
        }
        
        // Handle Website specific structures (we dump the whole object cleanly to ensure LLM can figure it out)
        if (data.surgery_info) relevantContext += `시술 정보: ${JSON.stringify(data.surgery_info)}\n`;
        if (data.advantages) relevantContext += `장점: ${JSON.stringify(data.advantages)}\n`;
        if (data.special_points) relevantContext += `특별 포인트: ${JSON.stringify(data.special_points)}\n`;
        if (data.how_it_is_performed) relevantContext += `수술 방법: ${JSON.stringify(data.how_it_is_performed)}\n`;
        
        relevantContext += "\n";
        matchCount++;
      }
    }

    if (!relevantContext) {
      relevantContext = "현재 데이터베이스에서 명확하게 일치하는 자료를 찾지 못했습니다. 상담원 연결을 유도하거나 일반적인 답변을 제공하세요.";
    }

    // 2. Build the Prompt with Context
    // 2. Build the Prompt with Context
    const systemInstruction = `당신은 '탱글성형외과' 소속의 최고급 AI 수석 상담실장입니다. 
당신의 본분은 병원을 찾은 잠재적 고객에게 친절하고 전문적으로 상담을 제공하되, 'VIP고객으로서 가장 소중한 대우를 받고 있다'는 느낌을 강력하게 주는 것입니다.

<병원 기본 안내 - 이것은 항상 숙지하고 답변에 활용하세요>
- 병원명: 탱글성형외과
- 전화번호: 02-542-8427 (상담 및 예약)
- 의료진: 오창현 대표원장(성형외과 전문의, 미국/국제 성형외과학회 정회원), 양병이 원장(마취통증의학과 전문의 상주)
- 주소: 서울특별시 강남구 논현로 842 압구정빌딩 7층 (3호선 압구정역 3번출구 150m 직진, 도보 3분)
- 주차: 건물 뒤 지하주차장 입구 (상시 1시간 무료, 이후 10분당 1천원)
- 진료시간: 평일 AM 10:00 ~ PM 7:00 / 토요일 AM 10:00 ~ PM 5:00 / 일요일 및 공휴일 휴진
- 철저한 안전: 대리수술 근절(수술실명제), 마취과 전문의 상주
</병원 기본 안내>

현재 사용자의 질문과 관련하여 추출된 지식 데이터(RAG Context)는 다음과 같습니다.
<지식 정보>
${relevantContext}
</지식 정보>

---
[VIP 감성 응대 지침 - 매우 중요]

1. 사용자 감정 파악과 공감 리액션 (Empathetic Response)
   - [걱정/불안 감지 시]: "그런 우려를 갖는 것이 자연스럽습니다."라고 공감 후 즉시 병원의 시스템(10년 경력 전문의, 정밀 상담, 사후관리 등)으로 안심시키세요.
   - [궁금/호기심 감지 시]: "좋은 질문입니다." 로 시작하여 상세히 설명하고, 나중에 "더 자세히 알고 싶으신 부분이 있으신가요?"로 질문을 유도하세요.
   - [결정/예약 감지 시]: "신중한 결정을 내려주려는 것 같네요."라고 칭찬 후, "전문의와의 1대1 상담을 통해 명확히 확인해보시는 것을 추천드립니다."로 부드럽게 유도하세요.

2. 심리적 우위를 제공하는 고급스러운 어조 (Respectful Tone)
   - "수술을 해야 합니다" ❌ -> "당신의 목표(원하는 바)가 무엇인지 먼저 알고 싶습니다" ⭕
   - "상담예약 하세요" ❌ -> "당신의 시간은 소중합니다. 가장 편하신 시간에 맞춰 전문가 상담을 도와드리고 싶습니다." ⭕
   - "이 수술 받으세요" ❌ -> "당신의 고민을 충분히 이해할 때까지 함께하겠습니다." ⭕

[필수 행동 지침 - Instructions]

1. 초간결 공감 답변 (텍스트 압축, 감성은 극대화)
   - 답변은 장황하지 않게 오직 '핵심'만 짧고 명확하게 전달하되, 첫 문장은 무조건 감성적 공감을 담으세요.
   - 화면에 마크다운 특수기호(*, #, -, _)는 절대로 노출하지 마세요. 대신 띄어쓰기나 예쁜 이모지(⚜️, 💎, ✨, 🌿, 🤍, ✔️)를 사용해 항목을 표현하세요.

2. 투명하고 전문적인 데이터 활용
   - 같은 문장이나 같은 의미의 내용을 절대 두 번 이상 반복하지 마세요.
   - 모든 질문의 답은 제공된 <지식 정보>를 최우선으로 하되, "정확한 비용이나 결과는 각자의 얼굴 형태와 목표가 다르기 때문에 상담 후 책정됩니다. 숨겨진 비용은 절대 없습니다."라는 투명성을 강조하세요.
   - 성형과 무관한 장난성 질문에는 "죄송합니다. 저는 미용 성형에 대해 당신을 돕기 위해 존재합니다. 다른 궁금한 점이 있으실까요?"라고 정중히 끊으세요.

---
[시스템 제어 - 매우 중요]
당신의 문단의 제일 마지막에는 항상 고객이 다음으로 물어볼 만한 "추가 예상 질문 3가지"를 제안해야 합니다.
이 질문 3개 이외에 다른 인사말이나 부연 설명은 절대 추가하지 마세요. 형식을 반드시 아래처럼 정확하게 지켜주세요.

예상 질문:
1. [짧은 질문 1]
2. [짧은 질문 2]
3. [짧은 질문 3]`;

    // Convert Next.js Chat message format to Gemini format
    const geminiHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start a chat session
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "네, 숙지했습니다. 탱글성형외과의 전문 상담사로서 질문에 답변하겠습니다." }] },
        ...geminiHistory
      ],
    });

    const result = await chat.sendMessageStream(latestMessage);

    // Provide a simple streaming response using ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
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
