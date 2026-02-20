"use client";

import React, { useState } from "react";

export const BACKGROUND_OPTIONS = [
  { id: "2026", label: "2026", src: "/images/background_2026.png" },
  { id: "2025", label: "2025", src: "/images/background_2025.png" },
] as const;

export type BackgroundId = (typeof BACKGROUND_OPTIONS)[number]["id"];

type BackgroundPickerBarProps = {
  value: string;
  onChange: (src: string) => void;
};

export default function BackgroundPickerBar({ value, onChange }: BackgroundPickerBarProps) {
  const [expanded, setExpanded] = useState(false);

  const selectedOption = BACKGROUND_OPTIONS.find((opt) => opt.src === value);

  return (
    <div
      className="fixed top-4 left-4 z-40 rounded-lg border border-zinc-700 overflow-hidden shadow-sm backdrop-blur-md bg-zinc-900/95 transition-all duration-300 ease-in-out font-dm-mono"
      style={{ width: expanded ? "auto" : "auto" }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-6 px-3 py-2 text-left w-full min-w-[200px] touch-none cursor-pointer"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse background picker" : "Expand background picker"}
      >
        <span className="text-sm font-medium text-zinc-100">
          background_img <span className="text-xs font-light">{selectedOption && `[selected:${selectedOption.label}]`}</span>
        </span>
        <svg
          className={`w-4 h-4 text-zinc-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="border-t border-zinc-700 px-3 py-2 flex flex-col gap-1">
          {BACKGROUND_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.src);
              }}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm font-light transition-colors cursor-pointer ${
                value === opt.src ? "bg-zinc-700 text-zinc-50" : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
