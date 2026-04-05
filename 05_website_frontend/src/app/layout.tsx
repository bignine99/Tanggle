import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import GlobalNav from "@/components/layout/GlobalNav";
import ChatFAB from "@/components/chat/ChatFAB";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "탱글성형외과 | 당신의 선택, 전문가의 책임",
  description: "과신하지 않는 성형의학. 믿을 수 있는 의료진, 투명한 후기, 책임 있는 관리를 선언하는 탱글성형외과입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} h-full antialiased scroll-smooth`}>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans text-tanggle-charcoal bg-tanggle-bg">
        <GlobalNav />
        {children}
        <ChatFAB />
      </body>
    </html>
  );
}
