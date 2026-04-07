"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TocItem {
  id: string;
  label: string;
}

export default function StickyToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Setup intersection observer to track which section is currently viewed
    const observers: IntersectionObserver[] = [];
    
    // Callback handles which item is active
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    // We set rootMargin to slightly offset the trigger point below the header
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset scrolling by ~120px to account for the LNB and Header spacing
      const y = element.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="sticky top-40 bg-white rounded-lg border border-neutral-100 p-6 shadow-sm hidden lg:block">
      <h4 className="text-xs font-bold tracking-widest text-primary-500 mb-6 uppercase">
        목차 (목표 안내)
      </h4>
      <nav className="flex flex-col gap-3 relative">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={`text-sm font-medium transition-all duration-300 relative pl-4 ${
                isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTocIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
