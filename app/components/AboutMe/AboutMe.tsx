"use client";

import React, { useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronsUpDown,
  Italic,
  List,
  Underline,
} from "lucide-react";
import type { Repo } from "@/lib/links";

const CURRENTLY = [
  { label: "living in", value: "Brooklyn" },
  { label: "working on", value: "something" },
  { label: "reading", value: "Dune" },
];

const FONTS = {
  "DM Mono": "var(--font-dm-mono), monospace",
  Helvetica: "Helvetica, Arial, sans-serif",
  Times: "'Times New Roman', Times, serif",
};
const SIZES = [10, 12, 14, 16, 18];
const SPACINGS = ["1.0", "1.5", "2.0"];
const ALIGNS = [
  { value: "left", Icon: AlignLeft },
  { value: "center", Icon: AlignCenter },
  { value: "right", Icon: AlignRight },
  { value: "justify", Icon: AlignJustify },
] as const;

// ruler is drawn at 72px per "inch", like TextEdit
const INCH = 72;
const RULER_INCHES = Array.from({ length: 16 }, (_, i) => i);

type Align = (typeof ALIGNS)[number]["value"];

const link = "text-[#0000ee] underline";

export default function AboutMe({ latestRepo }: { latestRepo?: Repo }) {
  const [font, setFont] = useState<keyof typeof FONTS>("DM Mono");
  const [size, setSize] = useState(12);
  const [spacing, setSpacing] = useState("1.5");
  const [color, setColor] = useState("#27272a");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState<Align>("left");
  const [zoomed, setZoomed] = useState(false);

  return (
    <section
      aria-label="About me"
      className={`flex flex-col min-h-0 min-w-0 w-full max-[850px]:h-[80vh] bg-white border border-zinc-300 rounded-xl shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)] overflow-hidden transition-[max-width] ${
        zoomed ? "h-full max-w-full" : "h-full max-w-4xl"
      }`}
    >
      {/* title bar */}
      <div className="relative shrink-0 h-10 flex items-center px-4 bg-[#f6f6f4]">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57] border border-black/10" aria-hidden />
          <span className="size-3 rounded-full bg-[#febc2e] border border-black/10" aria-hidden />
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Restore window" : "Zoom window"}
            className="size-3 rounded-full bg-[#28c840] border border-black/10 max-[850px]:pointer-events-none"
          />
        </div>
        <h2 className="absolute inset-x-0 m-0 text-center text-[13px] font-semibold text-zinc-700 pointer-events-none font-[-apple-system,BlinkMacSystemFont,sans-serif]">
          about_me.txt
        </h2>
      </div>

      {/* toolbar */}
      <div className="shrink-0 flex items-center gap-3 px-3 pb-2 bg-[#f6f6f4] text-zinc-700 text-[13px] font-[-apple-system,BlinkMacSystemFont,sans-serif] overflow-x-auto">
        <Picker label="Font" value={font} onChange={(v) => setFont(v as keyof typeof FONTS)} className="w-32">
          {Object.keys(FONTS).map((f) => (
            <option key={f}>{f}</option>
          ))}
        </Picker>
        <Picker
          label="Style"
          value={bold ? "Bold" : "Regular"}
          onChange={(v) => setBold(v === "Bold")}
          className="w-28 max-[850px]:hidden"
        >
          <option>Regular</option>
          <option>Bold</option>
        </Picker>
        <Picker
          label="Size"
          value={String(size)}
          onChange={(v) => setSize(Number(v))}
          className="w-16"
          icon={<ChevronDown size={12} />}
        >
          {SIZES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Picker>

        <label
          className="shrink-0 relative size-6 overflow-hidden rounded border border-zinc-300 cursor-pointer"
          title="Text color"
        >
          <span className="absolute inset-[3px] rounded-sm" style={{ background: color }} />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Text color"
            className="absolute inset-0 size-full opacity-0 cursor-pointer"
          />
        </label>

        <div className="shrink-0 flex items-center">
          <ToolButton label="Bold" active={bold} onClick={() => setBold((b) => !b)}>
            <Bold size={15} strokeWidth={2.5} />
          </ToolButton>
          <ToolButton label="Italic" active={italic} onClick={() => setItalic((i) => !i)}>
            <Italic size={15} />
          </ToolButton>
          <ToolButton label="Underline" active={underline} onClick={() => setUnderline((u) => !u)}>
            <Underline size={15} />
          </ToolButton>
        </div>

        <div className="shrink-0 flex items-center">
          {ALIGNS.map(({ value, Icon }) => (
            <ToolButton key={value} label={`Align ${value}`} active={align === value} onClick={() => setAlign(value)}>
              <Icon size={16} />
            </ToolButton>
          ))}
        </div>

        <Picker label="Line spacing" value={spacing} onChange={setSpacing} className="w-16">
          {SPACINGS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Picker>

        <span className="shrink-0 flex items-center gap-1 text-zinc-500 max-[850px]:hidden" aria-hidden>
          <List size={16} />
          <ChevronDown size={12} />
        </span>
      </div>

      {/* ruler */}
      <div
        aria-hidden
        className="shrink-0 relative h-7 overflow-hidden border-y border-zinc-200 bg-white text-[10px] text-zinc-700 font-[-apple-system,BlinkMacSystemFont,sans-serif]"
      >
        <div
          className="absolute left-3 right-0 bottom-0 h-1.5"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, #a1a1aa 0 1px, transparent 1px ${INCH / 8}px)`,
          }}
        />
        {RULER_INCHES.map((i) => (
          <React.Fragment key={i}>
            <span className="absolute bottom-0 h-3 w-px bg-zinc-500" style={{ left: 12 + i * INCH }} />
            <span className="absolute bottom-0.5 leading-none" style={{ left: 15 + i * INCH }}>
              {i}
            </span>
            {/* tab stops every half inch */}
            {[0.5, 1].map((h) => (
              <span
                key={h}
                className="absolute top-1 size-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-zinc-500"
                style={{ left: 9 + (i + h) * INCH }}
              />
            ))}
          </React.Fragment>
        ))}
        <span className="absolute top-1 left-[7px] size-0 border-x-[5px] border-x-transparent border-t-[7px] border-t-zinc-600" />
      </div>

      {/* page */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-3 py-4 [&_p]:m-0"
        style={{
          fontFamily: FONTS[font],
          fontSize: size,
          lineHeight: Number(spacing) * 1.4,
          color,
          fontWeight: bold ? 600 : 400,
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
          textAlign: align,
        }}
      >
        <div className="flex flex-col gap-[1em] max-w-[6.5in]">
          <p>
            hi, i&apos;m jade - i&apos;m a full stack software engineer currently working at{" "}
            <a className={link} href="https://www.linkedin.com/company/camberhealth/" target="_blank" rel="noreferrer">
              camber
            </a>
            . enjoying my work most when making sense of hard problems and seeing my ideas come to life through code.
          </p>

          <dl className="m-0">
            {CURRENTLY.map(({ label, value }) => (
              <div key={label}>
                <dt className="inline">{label}: </dt>
                <dd className="inline m-0">
                  {label === "working on" && latestRepo ? (
                    <a className={link} href={latestRepo.html_url} target="_blank" rel="noreferrer">
                      {latestRepo.name}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p>
            <a
              className={link}
              target="_blank"
              rel="noreferrer"
              href="https://open.spotify.com/album/77CZUF57sYqgtznUe3OikQ?si=X7WEbkC2T2aAXlfijmfmiQ"
            >
              i love my computer
            </a>{" "}
            {"<3"}.<span className="caret" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}

function Picker({
  label,
  value,
  onChange,
  className = "",
  icon = <ChevronsUpDown size={12} />,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className={`shrink-0 relative flex items-center ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none h-7 pl-2.5 pr-6 rounded-md border border-zinc-300 bg-white/60 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {children}
      </select>
      <span className="absolute right-2 pointer-events-none text-zinc-500">{icon}</span>
    </label>
  );
}

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`size-7 flex items-center justify-center rounded-md ${active ? "bg-zinc-200 text-zinc-900" : "text-zinc-600 hover:bg-zinc-200/60"}`}
    >
      {children}
    </button>
  );
}
