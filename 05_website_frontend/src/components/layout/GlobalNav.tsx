import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function GlobalNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-neutral-900">
          TANGGLE
        </Link>
        
        <div className="hidden md:flex gap-8 items-center font-bold text-sm text-neutral-900">
          <Link href="/procedures" className="hover:text-primary-500 transition-colors">시술소개</Link>
          <Link href="/ai-preview" className="hover:text-primary-500 transition-colors">AI뷰티프리뷰</Link>
          <Link href="/doctors" className="hover:text-primary-500 transition-colors">의료진소개</Link>
          <Link href="/community" className="hover:text-primary-500 transition-colors">커뮤니티</Link>
          <Link href="/clinic" className="hover:text-primary-500 transition-colors">의원소개</Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link href="/consult" className="flex items-center gap-2 text-sm font-bold bg-neutral-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors">
            <CalendarCheck2 className="w-4 h-4" /> 예약/상담
          </Link>
        </div>
      </div>
    </nav>
  );
}
