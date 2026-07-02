"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Sparkles, ChevronDown, Play } from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
};

// YouTube logic removed for generic clinic branding

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Global toggle for Chatbot Activation
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_CHAT !== "false";

  if (!isEnabled) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "좋은 아침입니다.";
    if (hour < 18) return "안녕하세요 편하신 시간이신가요.";
    return "저녁 시간이네요. 편안한 상담을 도와드리겠습니다.";
  };

  useEffect(() => {
    // Initialize welcome message dynamically on the client
    const visitCountStr = localStorage.getItem('visitCount');
    let intro = "";
    
    if (!visitCountStr) {
      localStorage.setItem('visitCount', '1');
      intro = `${getGreeting()}\n오창현 대표원장님의 15년 거상술 노하우를 학습한 **Aura AI 수석 상담실장**입니다.\n\n처음 방문해주셨군요! 우리 병원을 소개해드릴까요? 궁금하신 시술이나 질문을 편하게 남겨주세요.`;
    } else {
      const newCount = parseInt(visitCountStr) + 1;
      localStorage.setItem('visitCount', newCount.toString());
      intro = `${getGreeting()}\n다시 찾아주셔서 감사합니다. **Aura AI 수석 상담실장**입니다.\n\n당신의 고민을 충분히 이해할 때까지 함께하겠습니다. 이전 상담내용에 이어 더 자세히 알고 싶으신 부분이 있으신가요?`;
    }
    
    setMessages([{ role: "model", content: intro }]);
  }, []);

  const quickPrompts = [
    "안면거상 흉터가 남을까요?",
    "복부거상 회복기간은?",
    "원장님의 수술 철학",
    "상담 예약 방법"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleConsultRouting = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/chat/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          sessionStorage.setItem("aura_chat_summary", data.summary);
        }
      }
      // Navigate to consult
      window.location.href = "/consult";
    } catch (error) {
      console.error("Summarization error:", error);
      // Even if it fails, go to consult
      window.location.href = "/consult";
    } finally {
      setIsSummarizing(false);
    }
  };

  const submitQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setIsLoading(true);

    try {
      const currentLangMatch = typeof document !== 'undefined' ? document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/) : null;
      let lang = "ko";
      if (currentLangMatch) {
         const parts = currentLangMatch[1].split('/');
         lang = parts[2] || "ko";
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, { role: "user", content: query }],
          language: lang
        })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown error");
        throw new Error(`서버 오류 (${response.status}): ${errText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { role: "model", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + chunk
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "model", content: "죄송합니다. 일시적인 오류가 발생했습니다.\n\n빠른 상담을 원하시면 010-4160-1876로 연락해 주세요. 확인 후 다시 시도해 주셔도 됩니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitQuery(input);
  };

  // Helper: parse message content
  const parseMessage = (content: string) => {
    const parts = content.split(/예상 질문:|추천 질문:|다음 질문:/);
    const rawMain = parts[0].trim().replace(/\*/g, '');
    const questionsStr = parts.length > 1 ? parts[1] : null;
    const suggestions = questionsStr
      ? questionsStr
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0)
          .slice(0, 3)
          .map(l => l.replace(/^[0-9]+\.\s*/, '').replace(/^[-*•]\s*/, '').replace(/\[|\]/g, '').trim())
      : [];

    // Remove [YOUTUBE:videoId] if hallucinated by AI
    const cleanText = rawMain.replace(/\[YOUTUBE:[a-zA-Z0-9_-]+\]/g, '').trim();

    return { cleanText, suggestions };
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            data-chat-fab="true"
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3.5 pr-6 pl-3 py-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(236,72,153,0.4)] instagram-gradient text-white transition-all duration-500 group border border-white/30 hover:shadow-[0_30px_80px_rgba(236,72,153,0.6)]"
          >
            {/* Animated SVG Aura Glow / Soft Elevation */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-pink-400 to-orange-400 opacity-20 group-hover:opacity-50 blur-2xl transition-opacity duration-700 pointer-events-none scale-125 group-hover:scale-150" />
            
            <div className="relative w-12 h-12 flex items-center justify-center bg-white/20 rounded-full border border-white/50 backdrop-blur-md shadow-inner transition-transform group-hover:rotate-12 duration-500">
              <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse" style={{ animationDuration: '1.5s' }} />
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left relative z-10">
              <span className="font-bold tracking-tight text-sm text-white drop-shadow-md">AI 수석 실장 상담</span>
              <span className="text-[11px] font-semibold text-white/90 tracking-wide">의학 지식 기반 실시간 매칭</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="notranslate fixed bottom-8 right-8 z-50 w-[90vw] max-w-[420px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-neutral-200 bg-white/95 backdrop-blur-xl"
            translate="no"
          >
            {/* Header */}
            <div className="bg-black text-white p-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/40 relative">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">AI 수석 진료실장</h3>
                  <p className="text-xs text-green-400 font-medium">온라인 (평균 답변시간 5초)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
              <div className="space-y-6">
                {messages.map((msg, idx) => {
                  const isLastMsg = idx === messages.length - 1;
                  const isStreaming = isLastMsg && isLoading && msg.role === "model";
                  const { cleanText, suggestions } = parseMessage(msg.content);

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className="flex flex-col gap-2 w-full"
                    >
                      <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {msg.role === "model" && (
                          <div className="w-8 h-8 rounded-full instagram-gradient text-white flex items-center justify-center shrink-0 shadow-md">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] px-5 py-3.5 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm ${
                          msg.role === "user" 
                            ? "bg-black text-white rounded-2xl rounded-tr-sm" 
                            : "bg-white/80 border border-neutral-100 rounded-2xl rounded-tl-sm text-black"
                        }`}>
                          {cleanText}
                        </div>
                      </div>

                      {/* YouTube Card removed */}
                      
                      {suggestions.length > 0 && msg.role === "model" && !isStreaming && (
                        <div className="ml-11 mt-1 mb-2 flex flex-col gap-2 max-w-[80%]">
                          <div className="text-[12px] font-bold text-pink-500 flex items-center gap-1.5 ml-1">
                            <Sparkles className="w-3 h-3" />
                            추천 질문
                          </div>
                          {suggestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => submitQuery(q)}
                              className="text-left text-[13px] bg-white border border-pink-100 hover:bg-pink-50 text-black px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-between group"
                            >
                              <span>{q}</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity text-pink-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full instagram-gradient text-white flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white/80 border border-neutral-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 w-20">
                      <div className="flex space-x-1.5 justify-center w-full">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 pb-3">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => submitQuery(prompt)}
                      className="px-3 py-1.5 text-xs font-medium bg-neutral-100 text-black border border-neutral-200 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Context To Consult Banner */}
            {messages.length > 1 && !isLoading && (
              <div className="px-4 pb-3">
                <button
                  onClick={handleConsultRouting}
                  disabled={isSummarizing}
                  className="w-full py-2.5 instagram-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSummarizing ? (
                    <span className="animate-pulse">대화 요약 정리 중...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      대화 내용을 바탕으로 진료 상담 접수하기
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-neutral-100">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="무엇이든 물어보세요..."
                  className="w-full pl-5 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-full text-[15px] outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-black transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-9 h-9 flex items-center justify-center instagram-gradient text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:opacity-90 transition-opacity "
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              <div className="mt-3 text-center">
                <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                  의료 정보는 AI가 요약한 참고용이며, 정확한 상담은 전문의 내원 상담을 권장합니다.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

