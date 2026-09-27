"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatDateShort, useLinkData } from "@/lib/links";

export default function LinkList() {
  const { rows, activity } = useLinkData();
  const [logsOpen, setLogsOpen] = useState(true);

  // logs start collapsed on mobile, where they sit below the spy box
  useEffect(() => {
    if (window.matchMedia("(max-width: 850px)").matches) setLogsOpen(false);
  }, []);

  return (
    <nav
      className="shrink-0 w-[460px] max-[850px]:w-full max-[850px]:order-2 flex flex-col font-dm-mono text-xs text-zinc-800 border-r border-black max-[850px]:border-r-0 max-[850px]:border-y bg-[#39ff14] overflow-y-auto max-[850px]:overflow-visible"
      aria-label="Contents"
    >
      <div className="px-4 pb-2">
        <ul className="list-none pl-0 m-0 table border-collapse">
          <li className="table-row">
            <div className="table-cell h-11 align-middle pr-3 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
              Links
            </div>
            <div className="table-cell h-11 align-middle text-zinc-600 text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
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
      </div>
      {activity.length > 0 && (
        <section className="flex-1 border-t border-black bg-[#f0ff90]" aria-label="Recent activity">
          <button
            type="button"
            onClick={() => setLogsOpen((open) => !open)}
            aria-expanded={logsOpen}
            aria-controls="activity-log"
            className="w-full min-h-11 px-4 flex items-center justify-between cursor-pointer text-zinc-600 text-[10px] uppercase tracking-wider font-semibold"
          >
            Recent Logs
            {logsOpen ? <Minus size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
          </button>
          <ol id="activity-log" hidden={!logsOpen} className="list-none m-0 px-4 pb-2">
            {activity.map((entry, i) => (
              <li key={i} className="pb-1.5 leading-snug truncate" title={`${entry.action} ${entry.target}`}>
                <time dateTime={entry.date} className="text-zinc-500 text-[10px]">
                  {formatDateShort(entry.date)}
                </time>{" "}
                <span aria-hidden>{entry.icon}</span> {entry.action}{" "}
                <a href={entry.link} target="_blank" rel="noreferrer" className="text-[#0000ee] underline bg-zinc-200/80">
                  {entry.target}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </nav>
  );
}
