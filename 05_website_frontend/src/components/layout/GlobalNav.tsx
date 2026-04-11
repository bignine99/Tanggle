"use client";

import Link from "next/link";
import { CalendarCheck2, Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/procedures", label: "시술소개" },
    { href: "/ai-preview", label: "AI뷰티프리뷰" },
    { href: "/doctors", label: "의료진소개" },
    { href: "/reviews", label: "리얼후기" },
    { href: "/community", label: "커뮤니티" },
    { href: "/clinic", label: "의원소개" },
  ];

  return (
    <>
      <nav className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 right-0 mx-auto ${
        scrolled
          ? 'top-4 w-[95%] max-w-6xl rounded-[2.5rem] bg-white/70 backdrop-blur-[24px] saturate-[1.5] shadow-[0_30px_80px_-15px_rgba(236,72,153,0.15)] border border-white/60 px-4 md:px-8'
          : 'top-0 w-full max-w-7xl nav-glass px-6'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-700 ${scrolled ? 'h-16' : 'h-24'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`text-xl font-serif tracking-[0.2em] uppercase transition-colors duration-500 ${
              scrolled ? 'text-neutral-800' : 'text-white'
            }`}>
              Aura Clinic
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex gap-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:opacity-100 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled
                    ? 'text-neutral-600 hover:text-neutral-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              href="/consult"
              className={`hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-500 ${
                scrolled
                  ? 'bg-neutral-900 text-white hover:bg-black'
                  : 'instagram-gradient text-white hover:opacity-90 shadow-sm'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" /> 예약/상담
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                scrolled ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white text-xl font-light tracking-wide hover:text-pink-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consult"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-3 instagram-gradient text-white shadow-sm rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            예약/상담
          </Link>
        </div>
      )}
    </>
  );
}
