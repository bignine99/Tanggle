import React from "react";

interface SpecialPointCardProps {
  title: string;
  items: string[];
}

export default function SpecialPointCard({ title, items }: SpecialPointCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-neutral-100 p-8 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary-500 rounded-full inline-block"></span>
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-4 text-neutral-600 leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center text-primary-500 text-sm font-semibold mt-0.5">
              {idx + 1}
            </span>
            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
