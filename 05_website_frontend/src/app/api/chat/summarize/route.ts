import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    
    const conversation = messages.map((m: any) => `${m.role === 'user' ? '고객' : '상담실장'}: ${m.content}`).join("\n");
    
    const prompt = `다음은 성형외과 AI 상담실장과 고객의 대화 기록입니다. 
이 고객이 전문의 진료 상담 예약을 신청하려고 합니다. 병원 원장님이 고객의 니즈를 한눈에 파악할 수 있도록 
고객의 가장 주된 '고민 원인'과 '관심 수술/부위'를 1인칭 시점(예: "~가 고민입니다", "~를 개선하고 싶습니다")으로 2~3문장으로 간결하고 자연스럽게 요약해주세요.
이 내용은 고객이 직접 입력하는 상담 폼 텍스트 영역에 들어갈 내용입니다. 다른 꾸밈말(수평선, 인사말 등) 없이 텍스트만 출력하세요.

대화 기록:
${conversation}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary: summary.trim() });
  } catch (error: any) {
    console.error("Summarize API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
