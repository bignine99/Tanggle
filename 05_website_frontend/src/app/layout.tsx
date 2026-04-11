import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import GlobalNav from "@/components/layout/GlobalNav";
import ChatFAB from "@/components/chat/ChatFAB";
import CommandPalette from "@/components/ui/CommandPalette";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const serifFont = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Aura Clinic | 당신의 선택, 전문가의 책임",
  description: "과신하지 않는 성형의학. 믿을 수 있는 의료진, 투명한 후기, 책임 있는 관리를 선언하는 Aura Clinic입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${serifFont.variable} h-full antialiased scroll-smooth`}>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="min-h-full flex flex-col font-sans text-neutral-900 bg-[#FFFFFF]">
        <GlobalNav />
        {/* Global Film Grain Overlay */}
        <div className="bg-noise fixed inset-0 pointer-events-none z-[100] mix-blend-overlay" />
        
        {children}
        <ChatFAB />
        <CommandPalette />
        
        {/* Google Translate Integration hidden container */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        
        <Script id="google-translate-config" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'ko',
                includedLanguages: 'ko,en,zh-CN,ja,ar,th,ru,vi',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload" 
        />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Hide Google Translate UI elements */
            .goog-te-banner-frame { display: none !important; }
            .goog-te-balloon-frame { display: none !important; }
            .goog-tooltip { display: none !important; }
            .goog-tooltip:hover { display: none !important; }
            .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
            
            /* Modern google translate iframe classes */
            iframe.skiptranslate { display: none !important; }
            .VIpgJd-Zvi9od-aZ2wEe-wOHMyf { display: none !important; }
            div.skiptranslate { display: none !important; }
            
            /* Prevent body/html from being pushed down by google translate banner */
            body { top: 0 !important; }
            html { top: 0 !important; }
            
            /* Prevent translation text override styling */
            font { background: transparent !important; }
          `
        }} />
      </body>
    </html>
  );
}
