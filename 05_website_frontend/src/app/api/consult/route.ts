import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // 이 부분에서 실제 운영 환경이라면 Supabase, Firebase 등 Database에 저장하거나
    // Nodemailer, Slack Webhook 등을 통해 병원 측으로 접수 알림을 보냅니다.
    console.log("\n==================================");
    console.log("🏥 [Aura Clinic] 신규 온라인 상담 접수");
    console.log("==================================");
    console.log("👤 고객 성함:", data.name);
    console.log("📞 전화 번호:", data.phone);
    console.log("👀 선택 부위:", data.parts?.join(", "));
    console.log("💬 고민 내용:\n" + data.concern);
    console.log("🔔 카카오톡 알림:", data.kakaoAlert ? "동의" : "미동의");
    console.log("==================================\n");

    return NextResponse.json({ success: true, message: "상담이 성공적으로 접수되었습니다." });
  } catch (error: any) {
    console.error("Consult API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
