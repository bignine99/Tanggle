"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
  { code: "th", label: "ไทย" },
  { code: "ru", label: "Русский" },
  { code: "vi", label: "Tiếng Việt" }
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // Read current language from google translate cookie if present
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split('/');
      if (parts.length > 2 && parts[2]) {
        setCurrentLang(parts[2]);
      }
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    setIsOpen(false);
    
    // Google Translate expects cookies in format /auto/en or /ko/en
    const domain = window.location.hostname;
    const cookieString = lang === 'ko' ? `/auto/ko` : `/ko/${lang}`;
    
    document.cookie = `googtrans=${cookieString}; path=/;`;
    if (domain !== 'localhost') {
      document.cookie = `googtrans=${cookieString}; domain=${domain}; path=/;`;
      // Handle Vercel wildcard domains if needed
      if (domain.includes('.')) {
        document.cookie = `googtrans=${cookieString}; domain=.${domain}; path=/;`;
      }
    }
    
    // Reload to apply translation
    window.location.reload();
  };

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || "한국어";

  return (
    <div className="relative notranslate" translate="no">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-bold text-neutral-600 bg-neutral-100 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
      >
        <Globe className="w-4 h-4 text-primary-500" />
        {currentLabel}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-neutral-100 overflow-hidden z-50">
          <ul className="flex flex-col">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    currentLang === lang.code 
                      ? "bg-primary-50 text-primary-600 font-bold" 
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
