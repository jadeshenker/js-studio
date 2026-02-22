"use client";

import React, { useState } from "react";
import { BACKGROUND_OPTIONS } from "@/components/BackgroundPickerBar/BackgroundPickerBar";

type CommandPanelProps = {
  backgroundSrc: string;
  onBackgroundChange: (src: string) => void;
  magnifierOn: boolean;
  onMagnifierChange: (on: boolean) => void;
};

export default function CommandPanel({
  backgroundSrc,
  onBackgroundChange,
  magnifierOn,
  onMagnifierChange,
}: CommandPanelProps) {
  const [imgSelectOpen, setImgSelectOpen] = useState(false);

  const selectedOption = BACKGROUND_OPTIONS.find((opt) => opt.src === backgroundSrc);

  return (
    <div
      className="fixed top-4 left-4 z-40 rounded-lg border border-zinc-700 overflow-hidden shadow-sm backdrop-blur-md bg-zinc-900/95 font-dm-mono min-w-[240px]"
      data-magnifier-ignore
    >
      {/* Row 1: background_img — dropdown with selected year */}
      <div className="border-b border-zinc-700">
        <div className="flex items-center justify-between gap-4 px-3 py-2.5">
          <span className="text-sm font-medium text-zinc-100">background_img</span>
          <button
            type="button"
            onClick={() => setImgSelectOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded border border-zinc-600 bg-zinc-800/80 px-2.5 py-1.5 text-sm font-light text-zinc-200 hover:bg-zinc-700/80 hover:border-zinc-500 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500"
            aria-expanded={imgSelectOpen}
            aria-haspopup="listbox"
          >
            <span>{selectedOption ? selectedOption.label : "—"}</span>
            <svg
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${imgSelectOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {imgSelectOpen && (
          <div className="border-t border-zinc-700 px-3 py-2 flex flex-col gap-0.5 bg-zinc-900/50">
            {BACKGROUND_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onBackgroundChange(opt.src);
                  setImgSelectOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm font-light transition-colors cursor-pointer ${
                  backgroundSrc === opt.src
                    ? "bg-zinc-700 text-zinc-50"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: magnifier — toggle (clear on vs off) */}
      <div className="flex items-center justify-between gap-4 px-3 py-2.5">
        <span className="text-sm font-medium text-zinc-100">magnifier</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-light tabular-nums ${
              magnifierOn ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {magnifierOn ? "On" : "Off"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={magnifierOn}
            onClick={() => onMagnifierChange(!magnifierOn)}
            className={`relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 px-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
              magnifierOn
                ? "border-emerald-500/70 bg-emerald-600/80 justify-end"
                : "border-zinc-600 bg-zinc-800 justify-start"
            }`}
            title={magnifierOn ? "Turn magnifier off" : "Turn magnifier on"}
          >
            <span
              className={`pointer-events-none block h-5 w-5 shrink-0 rounded-full shadow ring-0 ${
                magnifierOn ? "bg-white" : "bg-zinc-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
