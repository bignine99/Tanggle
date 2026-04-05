import Link from "next/link";
import { Phone, CalendarCheck2 } from "lucide-react";

export default function GlobalNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-tanggle-charcoal/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-tanggle-charcoal">
          TANGGLE
        </Link>
        
        <div className="hidden md:flex gap-8 items-center font-bold text-sm text-tanggle-charcoal">
          <Link href="/procedures" className="hover:text-tanggle-gold transition-colors">시술소개</Link>
          <Link href="/doctors" className="hover:text-tanggle-gold transition-colors">의료진소개</Link>
          <Link href="/community" className="hover:text-tanggle-gold transition-colors">커뮤니티</Link>
          <Link href="/clinic" className="hover:text-tanggle-gold transition-colors">의원소개</Link>
        </div>

        <div className="flex items-center gap-3">
          <a href="tel:02-542-8427" className="hidden lg:flex items-center gap-2 text-sm font-bold text-tanggle-charcoal bg-tanggle-bg px-4 py-2 rounded-full hover:bg-tanggle-beige/40">
            <Phone className="w-4 h-4" /> 02-542-8427
          </a>
          <Link href="/consult" className="flex items-center gap-2 text-sm font-bold bg-tanggle-charcoal text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors">
            <CalendarCheck2 className="w-4 h-4" /> 예약/상담
          </Link>
        </div>
      </div>
    </nav>
  );
}
