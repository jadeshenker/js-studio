"use client";

import React from "react";
import { BACKGROUND_OPTIONS } from "@/components/BackgroundPickerBar/BackgroundPickerBar";

const BRAT_GREEN = "#B8FF3B";

type CommandPanelProps = {
  backgroundSrc: string;
  onBackgroundChange: (src: string) => void;
  magnifierOn: boolean;
  onMagnifierChange: (on: boolean) => void;
};

export default function CommandPanel({ backgroundSrc, onBackgroundChange, magnifierOn, onMagnifierChange }: CommandPanelProps) {
  return (
    <div
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-md border border-zinc-800/80 bg-zinc-900/98 px-4 py-2 shadow-sm backdrop-blur-md font-dm-mono"
      data-magnifier-ignore
    >
      <div className="flex items-center gap-6 text-sm text-zinc-100 whitespace-nowrap">
        {/* magnifier [insert toggle] */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-zinc-400">magnifier</span>
          <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1">
            <span
              className={`text-xs tabular-nums ${magnifierOn ? "" : "text-zinc-500"}`}
              style={magnifierOn ? { color: BRAT_GREEN } : undefined}
            >
              {magnifierOn ? "on" : "off"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={magnifierOn}
              onClick={() => onMagnifierChange(!magnifierOn)}
              className={`relative inline-flex items-center h-5 w-9 shrink-0 cursor-pointer rounded-full border px-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-900 ${
                magnifierOn ? "border-zinc-500 justify-end" : "border-zinc-600 bg-zinc-800 justify-start"
              }`}
              style={magnifierOn ? { backgroundColor: BRAT_GREEN } : undefined}
              title={magnifierOn ? "turn magnifier off" : "turn magnifier on"}
            >
              <span
                className={`pointer-events-none block h-4 w-4 shrink-0 rounded-full shadow ring-0 ${
                  magnifierOn ? "bg-zinc-900" : "bg-zinc-400"
                }`}
              />
            </button>
          </div>
        </div>

        {/* background img bg_2025 bg_2026 */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-zinc-400">background_img</span>
          <div className="flex items-center gap-2">
            {BACKGROUND_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onBackgroundChange(opt.src)}
                className="px-2 py-0.5 rounded-full border border-transparent text-xs transition-colors cursor-pointer hover:border-zinc-600 hover:bg-zinc-900"
                style={backgroundSrc === opt.src ? { color: BRAT_GREEN, borderColor: BRAT_GREEN } : { color: "#e4e4e7" }}
              >
                {`bg_${opt.label}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
