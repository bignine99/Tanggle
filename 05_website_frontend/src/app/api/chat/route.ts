import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// --------------------------------------------------------------------------
// 1. Initialize Gemini API
// --------------------------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 0.1, // Prevent hallucinations
    topK: 10,
    topP: 0.1,
  }
});

// --------------------------------------------------------------------------
// 2. Global Data Cache (Full-Context Injection)
// Instead of RAG, we load all data into memory and inject it into the prompt.
// Gemini Flash has a 1M token window, which easily fits our ~500KB JSON data.
// --------------------------------------------------------------------------
let globalKnowledgeBase = "";
let isDataLoaded = false;

function loadAllKnowledgeData() {
  if (isDataLoaded) return;
  
  try {
    const dataPath = path.join(process.cwd(), "..", "02_processed_data", "structured_data");
    
    function getAllJsonFiles(dirPath: string, files: string[] = []) {
      if (!fs.existsSync(dirPath)) return files;
      
      for (const file of fs.readdirSync(dirPath)) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          getAllJsonFiles(fullPath, files);
        } else if (file.endsWith(".json")) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const allFiles = getAllJsonFiles(dataPath);
    
    let combinedData = "";
    
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const data = JSON.parse(content);
        const folderName = path.basename(path.dirname(file));
        
        const title = data.metadata?.title || data.procedure_name || data.category || "정보";
        let chunk = `\n--- [${folderName} / ${title}] ---\n`;
        
        // Remove redundant/heavy arrays to optimize a little, but keep core data
        if (data.surgery_info) chunk += `시술 정보: ${JSON.stringify(data.surgery_info)}\n`;
        if (data.procedure_overview) chunk += `시술 정보: ${JSON.stringify(data.procedure_overview)}\n`;
        if (data.content?.summary) chunk += `요약: ${data.content.summary}\n`;
        if (data.summary) chunk += `요약: ${data.summary}\n`;
        if (data.advantages) chunk += `장점: ${JSON.stringify(data.advantages)}\n`;
        if (data.special_points) chunk += `특징: ${JSON.stringify(data.special_points)}\n`;
        if (data.face_lifting_methods) chunk += `얼굴 리프팅: ${JSON.stringify(data.face_lifting_methods)}\n`;
        if (data.neck_lifting) chunk += `목 리프팅: ${JSON.stringify(data.neck_lifting)}\n`;
        if (data.doctor_expertise) chunk += `의료진 전문성: ${JSON.stringify(data.doctor_expertise)}\n`;
        
        if (data.content?.qa_pairs) {
          chunk += "Q&A:\n";
          data.content.qa_pairs.forEach((qa: any) => {
            chunk += ` Q: ${qa.question}\n A: ${qa.answer}\n`;
          });
        }
        
        // Extract YouTube ID
        if (data.video_id) {
          chunk += `관련 유튜브 영상 ID: ${data.video_id}\n`;
        } else if (data.metadata?.youtube_url) {
          const match = data.metadata.youtube_url.match(/v=([a-zA-Z0-9_-]+)/);
          if (match) chunk += `관련 유튜브 영상 ID: ${match[1]}\n`;
        }
        
        combinedData += chunk;
      } catch (e) {
        // console.error("Parse error file:", file);
      }
    }
    
    globalKnowledgeBase = combinedData;
    isDataLoaded = true;
    console.log(`Knowledge Base Loaded: ${globalKnowledgeBase.length} bytes`);
    
  } catch (error) {
    console.error("Failed to load knowledge base:", error);
    globalKnowledgeBase = "데이터 로드 실패";
  }
}

// --------------------------------------------------------------------------
// 3. API Handler
// --------------------------------------------------------------------------
export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  // Load data if not loaded (Cold Start)
  loadAllKnowledgeData();

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    // Build the PROMPT
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

당신에게 제공되는 모든 탱글성형외과의 지식 베이스(데이터베이스 전체)입니다:
<전체 지식 데이터베이스>
${globalKnowledgeBase}
</전체 지식 데이터베이스>

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

1. 정확성 및 간결성
   - 답변은 장황하지 않게 오직 '핵심'만 짧고 명확하게 전달하되, 첫 문장은 무조건 감성적 공감을 담으세요.
   - 🚨[중요] **반드시 <전체 지식 데이터베이스>에 존재하는 데이터만 바탕으로 답변하세요.**
   - 만약 제공된 정보에 고객의 질문(특히 비용/가격 등)에 대한 구체적인 수치나 데이터가 있다면 **숨기지 말고 적극적으로 안내하세요.** (예: "데이터에 따르면 대략 00만원 선부터 시작됩니다.") 단, "개인의 상태에 따라 변동될 수 있습니다"라는 안내를 덧붙이세요.
   - 정보가 데이터베이스에 명확히 없다면 억지로 지어내지 말고, "자세한 부분은 02-542-8427로 내원 상담을 예약하시면 원장님께서 직접 안내해 주실 것입니다." 라고 정중히 안내하세요.

2. 미디어(유튜브) 노출 지침
   - 🚨[중요] **답변에 참고한 <전체 지식 데이터베이스>의 항목 중 '관련 유튜브 영상 ID'가 존재한다면**, 전체 답변의 제일 마지막(예상 질문 직전)에 딱 한 번만 "[YOUTUBE:영상ID]" 토큰을 삽입하세요. 
   - 예시: [YOUTUBE:t39UpeIp2wk]

3. 출력 포맷
   - 마크다운 특수문자(*, #, -, _)를 절대 화면에 텍스트로 노출하지 마세요.
   - 같은 문장이나 같은 의미의 내용을 구조만 바꿔서 두 번 이상 반복하지 마세요.

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
          parts: [{ text: "네, 저는 숙지했습니다. 탱글성형외과의 전체 데이터를 완벽히 인지한 수석 상담실장으로서 정확하고 전문적으로 응대하겠습니다." }] 
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
          controller.enqueue(new TextEncoder().encode("\n\n죄송합니다. 답변 생성 중 일시적인 오류가 발생했습니다. 02-542-8427로 문의 부탁드립니다."));
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
