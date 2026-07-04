"use client";

import React from "react";
import { useLinkRows } from "@/lib/links";

export default function LinkList() {
  const rows = useLinkRows();

  return (
    <nav
      className="shrink-0 font-dm-mono text-xs text-zinc-800 border-r border-black max-[850px]:border-r-0 max-[850px]:border-b bg-[#39ff14] overflow-y-auto px-4 py-2"
      aria-label="Contents"
    >
      <ul className="list-none pl-0 m-0 table border-collapse">
        <li className="table-row">
          <div className="table-cell align-baseline pb-1 pr-3 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
            Links
          </div>
          <div className="table-cell align-baseline pb-1 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
            Updated @
          </div>
        </li>
        {rows.map((row, i) => (
          <li key={i} className="table-row">
            <div className="table-cell align-baseline pb-1.5 pr-3 whitespace-nowrap">
              <span className="shrink-0" aria-hidden>
                {row.icon}
              </span>{" "}
              <a href={row.link} target="_blank" rel="noreferrer" className="text-[#0000ee] underline bg-zinc-200/80">
                {row.name}
              </a>
            </div>
            <div className="table-cell align-baseline pb-1.5 text-zinc-500 text-[10px] whitespace-nowrap">
              {row.modifiedAtShort || "--"}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
