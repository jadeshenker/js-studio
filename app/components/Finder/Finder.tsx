"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, Laptop } from "lucide-react";
import TrafficLights from "@/components/Window/TrafficLights";
import { useDraggable } from "@/components/Window/useDraggable";

export interface FinderItem {
  name: string;
  modified: string;
  type: string;
  link: string;
}

const system = "font-[-apple-system,BlinkMacSystemFont,sans-serif]";
const columns = "grid grid-cols-[minmax(0,1fr)_12rem_5rem] max-[850px]:grid-cols-[minmax(0,1fr)_5rem]";
const stripe = (i: number) => (i % 2 ? "bg-[#f4f5f5]" : "");
const FILLER_ROWS = 40;

export default function Finder({
  title,
  items,
  loading,
  onClose,
  className = "",
  style,
  onPointerDown,
}: {
  title: string;
  items: FinderItem[];
  loading?: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  onPointerDown?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const drag = useDraggable();
  const message = loading ? "loading…" : items.length === 0 ? "this folder is empty" : null;
  const rowCount = message ? 1 : items.length;

  return (
    <section
      ref={drag.ref}
      aria-label={title}
      onPointerDown={onPointerDown}
      style={{ ...style, ...drag.style }}
      className={`flex bg-white border border-zinc-300 rounded-xl shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)] overflow-hidden text-[13px] ${system} ${className}`}
    >
      <aside className="shrink-0 w-44 flex flex-col bg-[#ececea] border-r border-zinc-200 max-[850px]:hidden">
        <div className="h-12 flex items-center px-4" {...drag.handleProps}>
          <TrafficLights onClose={onClose} />
        </div>
        <p className="m-0 px-4 pt-2 pb-1 text-[11px] font-semibold text-zinc-400">Location</p>
        <div className="mx-2 h-7 px-2 flex items-center gap-2 rounded-md bg-black/10 text-zinc-800">
          <Laptop size={15} className="text-zinc-600" aria-hidden />
          me
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="shrink-0 h-12 flex items-center gap-5 px-4 border-b border-zinc-200" {...drag.handleProps}>
          <div className="hidden max-[850px]:block">
            <TrafficLights onClose={onClose} />
          </div>
          <div className="flex items-center gap-2 text-zinc-300" aria-hidden>
            <ChevronLeft size={20} />
            <ChevronRight size={20} />
          </div>
          <h2 className="m-0 text-[15px] font-semibold text-zinc-700">{title}</h2>
        </div>

        <div
          className={`shrink-0 ${columns} h-7 items-center px-4 border-b border-zinc-200 text-[11px] text-zinc-500`}
          aria-hidden
        >
          <span className="flex items-center justify-between pr-2 border-r border-zinc-200 font-semibold text-zinc-700">
            Name <ChevronUp size={12} />
          </span>
          <span className="px-2 border-r border-zinc-200 max-[850px]:hidden">Date Modified</span>
          <span className="px-2">Type</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col p-2" onClick={() => setSelected(null)}>
          <ul className="shrink-0 list-none m-0 p-0">
            {message && <li className="h-6 flex items-center px-2 text-zinc-500">{message}</li>}
            {!message &&
              items.map((item, i) => {
                const isSelected = selected === i;
                return (
                  <li key={i}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      title={item.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        // detail is 0 for keyboard activation
                        if (e.detail === 0 || e.metaKey || e.ctrlKey) return;
                        e.preventDefault();
                        setSelected(i);
                      }}
                      onDoubleClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
                      onFocus={() => setSelected(i)}
                      className={`${columns} h-6 items-center px-2 rounded-md cursor-pointer select-none no-underline outline-none ${
                        isSelected ? "bg-[#2463db] text-white" : `text-zinc-800 ${stripe(i)}`
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className={`px-2 truncate max-[850px]:hidden ${isSelected ? "text-white" : "text-zinc-500"}`}>
                        {item.modified || "--"}
                      </span>
                      <span className={`px-2 truncate ${isSelected ? "text-white" : "text-zinc-500"}`}>{item.type}</span>
                    </a>
                  </li>
                );
              })}
          </ul>
          <div className="flex-1 min-h-0 overflow-hidden" aria-hidden>
            {Array.from({ length: FILLER_ROWS }, (_, i) => (
              <div key={i} className={`h-6 rounded-md ${stripe(rowCount + i)}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
