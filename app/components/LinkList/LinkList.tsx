"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useLinkRows } from "@/lib/links";

function LinkItems({ expanded, rows }: { expanded: boolean; rows: ReturnType<typeof useLinkRows> }) {
  return (
    <>
      {rows.map((row, i) => (
        <li key={i} className="shrink-0 whitespace-nowrap">
          <div className="flex items-baseline gap-1.5">
            <span className="shrink-0" aria-hidden>
              {row.icon}
            </span>
            <a
              href={row.link}
              target="_blank"
              rel="noreferrer"
              className="text-[#0000ee] underline hover:bg-zinc-200/80 whitespace-nowrap"
            >
              {row.name}
            </a>
          </div>
          {expanded && <div className="text-zinc-500 text-[10px]">{row.modifiedAtShort}</div>}
        </li>
      ))}
    </>
  );
}

export default function LinkList() {
  const rows = useLinkRows();
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className="sticky top-0 left-0 right-0 shrink-0 font-dm-mono text-xs text-zinc-800 border-b border-zinc-700 bg-white/80 backdrop-blur-sm z-10 overflow-x-auto px-4 py-2"
      aria-label="Contents"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse links" : "Expand links"}
          className="shrink-0 p-0.5 rounded text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className="shrink-0 text-[11px] text-zinc-600 uppercase tracking-wider py-0.5">
          <div className="font-semibold">Links</div>
          {expanded && <div className="text-[10px]">Date Updated</div>}
        </div>
        <ul className="list-none pl-0 m-0 flex items-baseline gap-x-6 flex-nowrap w-max min-w-0">
          <LinkItems expanded={expanded} rows={rows} />
        </ul>
      </div>
    </nav>
  );
}
