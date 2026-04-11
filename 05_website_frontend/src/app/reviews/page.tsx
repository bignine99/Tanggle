"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageSquare, PlayCircle, ShieldCheck, Search, ChevronDown, ChevronUp } from "lucide-react";
import { QA_DATA } from "../../data/qa-data";

export default function CommunityPage() {
  const [playingVideos, setPlayingVideos] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("텍스트후기");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQA, setOpenQA] = useState<number[]>([]);

  const toggleQA = (id: number) => {
    setOpenQA(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const togglePlay = (id: number) => {
    if (!playingVideos.includes(id)) {
      setPlayingVideos(prev => [...prev, id]);
    } else {
      setPlayingVideos(prev => prev.filter(v => v !== id));
    }
  };

  const TEXT_REVIEWS = [
    { id: 1, name: "김지영", age: "40대", gender: "여", procedure: "얼굴거상", rating: 5, date: "2024.03.15", content: "처진 볼살 때문에 항상 나이 들어 보였는데, 아우라클리닉에서 얼굴거상 후 10년은 젊어진 것 같아요! 회복도 빠르고 이수현 원장님이 너무 친절하십니다. 흉터가 거의 안보여서 일상생활 복귀도 엄청 빠르네요." },
    { id: 2, name: "박성민", age: "50대", gender: "남", procedure: "얼굴거상", rating: 4.5, date: "2024.03.02", content: "남자가 거상을 하는게 맞나 고민이 많았는데, 흉터도 거의 없고 아주 자연스럽게 리프팅되어 대만족입니다. 주변에서 인상이 훨씬 부드러워 보인다고 칭찬이 자자합니다." },
    { id: 3, name: "이수진", age: "30대", gender: "여", procedure: "이마거상", rating: 5, date: "2024.02.28", content: "눈이 쳐져서 답답해 보였는데 이마거상으로 눈꺼풀 쳐짐까지 개선됐어요. 무쌍인 눈매가 훨씬 시원하고 또렷해져서 거울 볼 맛이 납니다. 강력 추천해요!" },
    { id: 4, name: "정은주", age: "40대", gender: "여", procedure: "이마거상", rating: 4.5, date: "2024.02.14", content: "이마 주름과 눈 처짐을 동시에 해결하고 싶어서 원장님 상담 후 진행했습니다. 수술 직후 며칠은 부기가 있었지만 한 달 지난 지금은 완전 만족합니다." },
    { id: 5, name: "최영호", age: "60대", gender: "남", procedure: "목거상", rating: 5, date: "2024.01.20", content: "나이가 들면서 칠면조처럼 목주름이 너무 늘어져 스트레스였는데, 지금은 목선이 팽팽하고 매끄러워져서 골프 치러 갈 때 넥타이 매는게 즐거울 정도입니다." },
    { id: 6, name: "한지민", age: "50대", gender: "여", procedure: "목거상", rating: 5, date: "2024.04.01", content: "얼굴은 다른 곳에서 관리로 팽팽한데 목만 자글자글해서 어색했어요. 목거상 후에는 얼굴과 목 라인이 매끄럽게 이어져서 원래 10년 전 제 모습 같아요." },
    { id: 7, name: "강효진", age: "20대", gender: "여", procedure: "지방흡입", rating: 4.5, date: "2024.03.22", content: "운동이랑 엄청난 다이어트를 해도 절대로 안 빠지던 허벅지 안쪽 승마살을 흡입했어요. 바지 핏이 달라져서 스키니진이나 슬랙스 입는 재미가 다릅니다." },
    { id: 8, name: "윤석태", age: "30대", gender: "남", procedure: "지방흡입", rating: 5, date: "2024.02.05", content: "술자리가 잦아 생겨난 복부 비만으로 고민이었는데 부작용 없이 복근 라인이 살아나는 느낌입니다. 남성 체형에 맞춰 근육 라인까지 섬세하게 잡아주셔서 압도적으로 만족합니다." },
    { id: 9, name: "오혜란", age: "40대", gender: "여", procedure: "지방흡입", rating: 5, date: "2024.01.12", content: "출산 후 처진 팔뚝살 지흡 후 여름이 오기만을 기다리고 있습니다! 민소매 나시티를 당당하게 입고 다닐 수 있겠어요. 피부 요철도 없고 원장님 손끝이 꼼꼼하십니다." },
    { id: 10, name: "임서영", age: "30대", gender: "여", procedure: "가슴거상", rating: 5, date: "2023.11.11", content: "출산과 모유수유 후 심하게 처진 가슴 때문에 우울증까지 왔었는데, 아우라클리닉에서 다시 예전 아가씨 때의 탄력과 볼륨감을 되찾았어요. 여자로서의 자존감 완벽 회복입니다!" },
    { id: 11, name: "조아라", age: "20대", gender: "여", procedure: "가슴거상", rating: 4.5, date: "2023.10.22", content: "가슴이 선천적으로 크고 처진 편이라 어떤 옷을 입어도 둔해보였는데, 거상술 후 탄력이 생겨서 너무 예뻐요. 흉터 관리도 병원에서 철저히 해주셔서 옅어지는게 눈에 보입니다." },
    { id: 12, name: "신현주", age: "40대", gender: "여", procedure: "엉덩이성형", rating: 5, date: "2024.03.09", content: "골반이 좁고 엉덩이가 납작해 핏이 안 살았는데, 이제는 골프웨어나 레깅스를 입을 때 뒤태가 남다릅니다. 자연스럽게 볼륨이 생겨서 너무 만족스러워요." },
    { id: 13, name: "박미경", age: "50대", gender: "여", procedure: "엉덩이성형", rating: 4.5, date: "2024.01.18", content: "나이 들수록 쳐지는 엉덩이 밑쪽 볼륨을 딱 끌어올려 주셔서 너무 만족해요. 이물감도 없고 원래 제 몸인 양 자연스럽게 자리 잡았습니다." },
    { id: 14, name: "유진아", age: "30대", gender: "여", procedure: "동안성형", rating: 5, date: "2024.02.05", content: "전체적인 얼굴 볼륨과 입체감이 부족해 피곤해보인다는 말을 자주 들었는데, 동안 패키지 후 얼굴 윤곽부터 피부결까지 완전히 빛이 나네요. 친구들이 다 어디서 했냐고 물어봐요~" },
    { id: 15, name: "정태양", age: "40대", gender: "남", procedure: "동안성형", rating: 5, date: "2023.12.30", content: "영업직이라 인상이 중요한데 나이 들면서 피로해 보인다는 말을 달고 살았습니다. 이제는 회사 동료나 거래처 사람들이 첫만남에서부터 확실히 긍정적인 평가를 해줍니다. 탁월한 투자였어요." },
  ];

  const PHOTO_REVIEWS = [
    { id: 1, name: "이현주", age: "40대", gender: "여", procedure: "얼굴거상", src: "/images/reviews/얼굴거상전후.png", content: "무너진 턱선과 전체적인 처짐이 너무 고민이었는데, 이수현 원장님 덕분에 10년 전 얼굴형을 되찾았습니다. 흉터 걱정도 없이 너무 자연스러워요!" },
    { id: 2, name: "송지영", age: "30대", gender: "여", procedure: "동안성형", src: "/images/reviews/동안성형전후.png", content: "얼굴 살이 빠지면서 눈코입이 따로 노는 느낌이었는데, 지방이식과 거상을 병행한 피부 볼륨감을 주셔서 인상이 예전처럼 밝고 어려졌어요." },
    { id: 3, name: "아나스타샤", age: "50대", gender: "여 (러시아)", procedure: "이마거상", src: "/images/reviews/이마거상전후.png", content: "눈 처짐 때문에 시야까지 불편했는데, 이마거상 후 이마 주름도 팽팽하게 펴지고 눈매가 시원해져서 거울 볼 맛이 납니다!" },
    { id: 4, name: "김태희", age: "30대", gender: "여", procedure: "가슴거상", src: "/images/reviews/가슴거상전후.png", content: "출산 후 심하게 처진 가슴 때문에 우울했었는데, 수술 후 예전 20대 때의 매력적인 볼륨감으로 돌아와 자존감을 회복했습니다. 감사합니다원장님." },
    { id: 5, name: "박수진", age: "30대", gender: "여", procedure: "지방흡입", src: "/images/reviews/지방흡입전후.png", content: "운동으로도 절대 빠지지 않던 허벅지 바깥쪽 군살을 완벽하게 정리해주셨어요. 바디라인이 매끄러워져서 이제 스키니진이나 슬랙스도 사이즈 구애 없이 맘껏 입어요." },
    { id: 6, name: "정미영", age: "50대", gender: "여", procedure: "목거상", src: "/images/reviews/목거상전후.png", content: "얼굴은 괜찮은데 나이가 들면서 목주름만 자글자글해 스카프만 하고 다녔었죠. 지금은 깔끔하고 매끈해진 목선 덕에 파인 옷도 당당하게 입습니다." },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">리얼후기</h1>
            <p className="text-lg text-neutral-500 font-light">검증된 환자들의 솔직한 후기와 질문</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <span className="flex items-center gap-1 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full"><ShieldCheck className="w-4 h-4" /> 실명 인증 작성만 노출</span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 mb-10 overflow-x-auto no-scrollbar border-b border-neutral-100">
          {["텍스트후기", "사진후기", "영상후기", "Q&A"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-bold whitespace-nowrap text-lg transition-colors ${
                activeTab === tab 
                  ? "text-neutral-900 border-b-2 border-neutral-900" 
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "영상후기" && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <PlayCircle className="text-primary-500" /> 생생 영상 후기
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 1, procedure: "주름제거", src: "/images/simulations/주름제거.gif", thumb: "/images/simulations/주름제거_thumb.png" },
                { id: 2, procedure: "리프팅", src: "/images/simulations/자연스런리프팅.gif", thumb: "/images/simulations/자연스런리프팅_thumb.png" },
                { id: 3, procedure: "가슴거상", src: "/images/simulations/가슴거상.gif", thumb: "/images/simulations/가슴거상_thumb.png" },
                { id: 4, procedure: "동안성형", src: "/images/simulations/동안성형.gif", thumb: "/images/simulations/동안성형_thumb.png" },
              ].map((video) => {
                const isPlaying = playingVideos.includes(video.id);
                return (
                  <div 
                    key={video.id} 
                    onClick={() => togglePlay(video.id)}
                    className="aspect-[9/16] bg-neutral-900 rounded-lg relative overflow-hidden group cursor-pointer shadow-sm"
                  >
                    {isPlaying ? (
                      <img src={video.src} alt={video.procedure} className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500" />
                    ) : (
                      <>
                        <img src={video.thumb} alt={`${video.procedure} 썸네일`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors z-10">
                          <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                        </div>
                        <div className="absolute bottom-4 left-4 z-20">
                          <p className="text-white font-bold drop-shadow-md">"{video.procedure} 시술 후 3주차 리얼 후기"</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "텍스트후기" && (
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {TEXT_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-lg">{review.name.substring(0,1)}** 님 ({review.age}/{review.gender})</h3>
                    <p className="text-sm font-medium text-neutral-500 mt-1">시술부위: <span className="text-primary-600">{review.procedure}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="flex text-primary-500 text-sm tracking-widest">
                      {review.rating === 5 ? "★★★★★" : "★★★★☆"}
                    </div>
                    <span className="text-xs text-neutral-400 mt-1 block">{review.date}</span>
                  </div>
                </div>
                <p className="text-neutral-700 font-light leading-relaxed mb-6">
                  {review.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-primary-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" /> 도움이 되었어요
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-800 transition-colors">
                    <MessageSquare className="w-4 h-4" /> 원장님 답변확인
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "사진후기" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {PHOTO_REVIEWS.map((review, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={review.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-100 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group"
              >
                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                  <img src={review.src} alt={`${review.procedure} 전후사진`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-sm backdrop-blur-md">
                    REAL STORY
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg mb-1">{review.name.substring(0,1)}** 님 ({review.age}/{review.gender})</h3>
                      <p className="text-xs text-primary-600 font-semibold mb-0.5">시술: {review.procedure}</p>
                    </div>
                    <div className="flex gap-0.5 text-primary-500 text-sm tracking-widest leading-none mt-1">★★★★★</div>
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed mb-6 font-light">
                    {review.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-primary-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" /> 도움됨 {30 + review.id * 5}</button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">
                      <MessageSquare className="w-4 h-4" /> 원장님 답변확인
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "Q&A" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Bar */}
            <div className="relative mb-10">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="궁금하신 점을 키워드로 검색해보세요. (예: 거상, 흉터, 회복기간)"
                className="w-full pl-11 pr-4 py-4 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* QA Board */}
            <div className="border-t border-neutral-200">
              {QA_DATA.filter(qa => 
                qa.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                qa.category.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="py-20 text-center text-neutral-400">
                  검색 결과가 없습니다.
                </div>
              ) : (
                QA_DATA.filter(qa => 
                  qa.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  qa.category.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((qa, index) => {
                  const isOpen = openQA.includes(qa.id);
                  return (
                    <motion.div 
                      key={qa.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % 10) * 0.05 }}
                      className="border-b border-neutral-100"
                    >
                      <button 
                        onClick={() => toggleQA(qa.id)}
                        className="w-full py-5 px-2 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-primary-500 font-bold text-lg min-w-[24px]">Q.</span>
                          <span className={`font-semibold text-base transition-colors ${isOpen ? 'text-primary-600' : 'text-neutral-800 group-hover:text-primary-500'}`}>
                            <span className="text-sm border border-neutral-200 text-neutral-500 rounded px-2 py-0.5 mr-3">{qa.category}</span>
                            {qa.question}
                          </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-300 group-hover:text-primary-500" />}
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6 pt-2 px-4 md:px-12 flex gap-4 bg-neutral-50/50 rounded-b-xl my-2 mx-2">
                              <span className="text-neutral-400 font-bold text-lg min-w-[24px]">A.</span>
                              <p className="text-neutral-600 font-light leading-relaxed">
                                {qa.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
