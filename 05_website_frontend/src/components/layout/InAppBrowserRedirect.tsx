"use client";

import { useEffect, useState } from "react";

export default function InAppBrowserRedirect() {
  const [isInApp, setIsInApp] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !navigator) return;

    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detect major in-app browsers
    const isKakao = userAgent.match(/kakaotalk/i);
    const isLine = userAgent.match(/line/i);
    const isInstagram = userAgent.match(/instagram/i);
    const isFacebook = userAgent.match(/fban|fbav/i);
    const isNaver = userAgent.match(/naver/i);
    const isThreads = userAgent.match(/threads/i);
    const isDaum = userAgent.match(/daumapps/i);
    
    if (isKakao || isLine || isInstagram || isFacebook || isNaver || isThreads || isDaum) {
      setIsInApp(true);
      const targetUrl = window.location.href;
      
      // Android: Force open Chrome using intent
      if (userAgent.match(/android/i)) {
        const intentUrl = targetUrl.replace(/https?:\/\//i, "");
        window.location.href = `intent://${intentUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      } 
      // iOS: Try kakao scheme for KakaoTalk, otherwise wait for user interaction
      else if (userAgent.match(/iphone|ipad|ipod/i)) {
         if (isKakao) {
            window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
         }
      }
    }
  }, []);

  if (!isInApp) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 mb-6">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-yellow-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">현재 환경은 로그인이 제한되어 있습니다.</h2>
      <p className="text-lg text-neutral-300 mb-6 leading-relaxed break-keep">
        보안상의 이유로 카카오톡, 인스타그램 등의 브라우저에서는 구글 로그인이 불가능합니다.<br/>
        화면 우측 하단(또는 상단)의 <strong className="text-white bg-neutral-800 px-2 py-1 rounded inline-block mx-1">⠇</strong> 버튼을 눌러<br/>
        <strong className="text-sky-400 ml-1">다른 브라우저로 열기(Safari/Chrome)</strong>를 선택해주세요.
      </p>
      
      <div className="mt-6 p-4 bg-neutral-800 rounded-lg w-full max-w-sm">
        <p className="text-sm text-neutral-400 mb-3">또는 아래 링크를 복사하여 Safari나 Chrome 앱에 붙여넣어주세요:</p>
        <div className="flex bg-neutral-900 border border-neutral-700 rounded-md overflow-hidden">
          <input 
            type="text" 
            readOnly 
            value={typeof window !== 'undefined' ? window.location.href : ''}
            className="bg-transparent text-white px-4 py-3 flex-1 w-full outline-none text-sm"
          />
          <button 
            className="bg-sky-600 hover:bg-sky-500 text-white px-4 font-medium transition-colors"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다. 시스템의 기본 웹 브라우저를 열고 붙여넣기 해주세요.");
              }
            }}
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
}
