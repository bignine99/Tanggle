import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
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
      <body className="min-h-full flex flex-col font-sans text-neutral-900 bg-[#FFFFFF]">
        <GlobalNav />
        {children}
        <ChatFAB />
        
        {/* Google Translate Integration hidden container */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        
        <Script id="google-translate-config" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'ko',
                includedLanguages: 'ko,en,zh-CN,ru,vi',
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
