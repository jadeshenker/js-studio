import React from "react";

export default function DesktopIcon({
  name,
  kind,
  selected,
  onOpen,
}: {
  name: string;
  kind: "folder" | "file";
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${name}`}
      className="group w-20 flex flex-col items-center gap-1 cursor-pointer outline-none"
    >
      <span
        className={`h-16 w-16 flex items-center justify-center rounded-md transition-[filter] group-hover:brightness-105 group-active:brightness-90 group-focus-visible:ring-2 group-focus-visible:ring-blue-400 ${
          selected ? "bg-black/15" : ""
        }`}
      >
        {kind === "folder" ? (
          <svg width="56" height="46" viewBox="0 0 56 46" aria-hidden>
            <path d="M2 6a4 4 0 0 1 4-4h14l5 5h25a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#5aa9ea" />
            <path d="M2 14a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#86c3f4" />
            <path d="M2 14a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v1H2z" fill="#a6d4f8" />
          </svg>
        ) : (
          <svg width="44" height="56" viewBox="0 0 44 56" aria-hidden>
            <path d="M4.5 1.5h25l13 13v37a3 3 0 0 1-3 3h-35a3 3 0 0 1-3-3v-47a3 3 0 0 1 3-3z" fill="#fbfbfa" stroke="#d4d4d0" />
            <path d="M29.5 1.5v10a3 3 0 0 0 3 3h10z" fill="#e2e2df" stroke="#d4d4d0" strokeLinejoin="round" />
            <text
              x="22"
              y="47"
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill="#8f8f8b"
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
            >
              TXT
            </text>
          </svg>
        )}
      </span>
      <span
        className={`px-1.5 rounded font-[-apple-system,BlinkMacSystemFont,sans-serif] text-xs font-medium leading-5 text-zinc-900 ${
          selected ? "bg-zinc-400/50" : ""
        }`}
      >
        {name}
      </span>
    </button>
  );
}
