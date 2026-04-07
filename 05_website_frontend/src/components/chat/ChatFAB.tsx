"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Sparkles, ChevronDown, Play } from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
};

// YouTube Video Card Component - Premium Design
function YouTubeCard({ videoId }: { videoId: string }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (showEmbed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="ml-11 mt-1 mb-2 w-[75%] rounded-xl overflow-hidden border border-tanggle-gold/30 shadow-[0_4px_20px_-4px_rgba(201,172,122,0.25)]"
      >
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="ml-11 mt-1 mb-2 w-[75%]"
    >
      <button
        onClick={() => setShowEmbed(true)}
        className="group relative w-full rounded-xl overflow-hidden border border-tanggle-gold/30 shadow-[0_4px_20px_-4px_rgba(201,172,122,0.2)] hover:border-tanggle-gold/60 transition-all hover:shadow-[0_4px_24px_-4px_rgba(201,172,122,0.35)]"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-tanggle-charcoal">
          <img
            src={thumbUrl}
            alt="영상 미리보기"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-tanggle-gold/90 flex items-center justify-center shadow-[0_0_30px_rgba(201,172,122,0.5)] group-hover:scale-110 transition-transform backdrop-blur-sm">
              <Play className="w-6 h-6 text-tanggle-charcoal ml-0.5" fill="currentColor" />
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <div className="px-2 py-0.5 rounded-md bg-tanggle-gold/90 text-[10px] font-bold text-tanggle-charcoal tracking-wide">
              ▶ 원장님 직강 영상
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      intro = `${getGreeting()}\n오창현 대표원장님의 15년 거상술 노하우를 학습한 **탱글 AI 수석 상담실장**입니다.\n\n처음 방문해주셨군요! 우리 병원을 소개해드릴까요? 궁금하신 시술이나 질문을 편하게 남겨주세요.`;
    } else {
      const newCount = parseInt(visitCountStr) + 1;
      localStorage.setItem('visitCount', newCount.toString());
      intro = `${getGreeting()}\n다시 찾아주셔서 감사합니다. **탱글 AI 수석 상담실장**입니다.\n\n당신의 고민을 충분히 이해할 때까지 함께하겠습니다. 이전 상담내용에 이어 더 자세히 알고 싶으신 부분이 있으신가요?`;
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

  const submitQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: query }] })
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
      setMessages(prev => [...prev, { role: "model", content: "죄송합니다. 일시적인 오류가 발생했습니다.\n\n빠른 상담을 원하시면 02-542-8427로 연락해 주세요. 확인 후 다시 시도해 주셔도 됩니다." }]);
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

    // Extract [YOUTUBE:videoId]
    const ytMatch = rawMain.match(/\[YOUTUBE:([a-zA-Z0-9_-]+)\]/);
    const videoId = ytMatch ? ytMatch[1] : null;
    const cleanText = rawMain.replace(/\[YOUTUBE:[a-zA-Z0-9_-]+\]/g, '').trim();

    return { cleanText, videoId, suggestions };
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
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(20,20,20,0.4)] bg-gradient-to-r from-tanggle-charcoal to-[#2A2A2A] text-white border border-tanggle-gold/30 hover:border-tanggle-gold/60 transition-colors group"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-tanggle-gold absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="w-6 h-6 text-tanggle-gold" />
            </div>
            <span className="font-bold tracking-tight text-sm md:text-base pr-1">AI 수석 실장에게 질문하기</span>
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
            className="fixed bottom-8 right-8 z-50 w-[90vw] max-w-[420px] h-[650px] max-h-[85vh] flex flex-col rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-tanggle-gold/20 bg-white/90 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-tanggle-charcoal to-[#2A2A2A] text-white p-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tanggle-gold/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-tanggle-gold/20 flex items-center justify-center border border-tanggle-gold/40 relative">
                  <Sparkles className="w-5 h-5 text-tanggle-gold" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-tanggle-charcoal"></div>
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
                  const { cleanText, videoId, suggestions } = parseMessage(msg.content);

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx} 
                      className="flex flex-col gap-2 w-full"
                    >
                      <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {msg.role === "model" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EBDABB] to-[#C9AC7A] text-tanggle-charcoal flex items-center justify-center shrink-0 shadow-md">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] px-5 py-3.5 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm ${
                          msg.role === "user" 
                            ? "bg-tanggle-charcoal text-white rounded-2xl rounded-tr-sm" 
                            : "bg-white/80 border border-tanggle-charcoal/10 rounded-2xl rounded-tl-sm text-tanggle-charcoal"
                        }`}>
                          {cleanText}
                        </div>
                      </div>

                      {/* YouTube Video Card - only show after streaming completes */}
                      {videoId && msg.role === "model" && !isStreaming && (
                        <YouTubeCard videoId={videoId} />
                      )}
                      
                      {suggestions.length > 0 && msg.role === "model" && !isStreaming && (
                        <div className="ml-11 mt-1 mb-2 flex flex-col gap-2 max-w-[80%]">
                          <div className="text-[12px] font-bold text-tanggle-gold flex items-center gap-1.5 ml-1">
                            <Sparkles className="w-3 h-3" />
                            추천 질문
                          </div>
                          {suggestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => submitQuery(q)}
                              className="text-left text-[13px] bg-white/60 backdrop-blur-md border border-tanggle-gold/30 hover:bg-tanggle-gold/10 hover:border-tanggle-gold/60 text-tanggle-charcoal px-4 py-2.5 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all flex items-center justify-between group"
                            >
                              <span>{q}</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity text-tanggle-gold" />
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EBDABB] to-[#C9AC7A] text-tanggle-charcoal flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white/80 border border-tanggle-charcoal/10 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 w-20">
                      <div className="flex space-x-1.5 justify-center w-full">
                        <div className="w-1.5 h-1.5 bg-tanggle-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-tanggle-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-tanggle-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                      className="px-3 py-1.5 text-xs font-medium bg-tanggle-gold/10 text-tanggle-charcoal border border-tanggle-gold/30 rounded-full hover:bg-tanggle-gold/20 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-tanggle-charcoal/10">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="무엇이든 물어보세요..."
                  className="w-full pl-5 pr-12 py-3.5 bg-tanggle-bg/80 border border-tanggle-charcoal/15 rounded-full text-[15px] outline-none focus:border-tanggle-gold focus:ring-1 focus:ring-tanggle-gold text-tanggle-charcoal transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-9 h-9 flex items-center justify-center bg-tanggle-charcoal text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-black transition-colors"
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
