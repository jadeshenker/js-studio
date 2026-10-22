"use client";

import React, { useState } from "react";
import { Info, Share, ZoomIn, ZoomOut } from "lucide-react";
import TrafficLights from "@/components/Window/TrafficLights";
import { useDraggable } from "@/components/Window/useDraggable";

const ZOOM_LEVELS = [1, 1.5, 2, 3];

export default function Preview({
  title,
  src,
  alt,
  onClose,
  onPointerDown,
  className = "",
  style,
}: {
  title: string;
  src: string;
  alt: string;
  onClose: () => void;
  onPointerDown?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [zoomIndex, setZoomIndex] = useState(0);
  const [maximized, setMaximized] = useState(false);
  const drag = useDraggable({ disabled: maximized });
  const zoom = ZOOM_LEVELS[zoomIndex];

  return (
    <section
      ref={drag.ref}
      aria-label={title}
      onPointerDown={onPointerDown}
      style={maximized ? { ...style, inset: "1rem", width: "auto", height: "auto" } : { ...style, ...drag.style }}
      className={`flex flex-col bg-white border border-zinc-300 rounded-xl shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)] overflow-hidden font-[-apple-system,BlinkMacSystemFont,sans-serif] ${className}`}
    >
      <div
        {...drag.handleProps}
        className="shrink-0 h-12 flex items-center gap-4 px-4 bg-[#f6f6f4] border-b border-zinc-200 text-zinc-600"
      >
        <TrafficLights
          onClose={onClose}
          onZoom={() => setMaximized((m) => !m)}
          zoomLabel={maximized ? "Restore window" : "Zoom window"}
        />
        <h2 className="flex-1 min-w-0 m-0 truncate text-[13px] font-semibold text-zinc-700">{title}</h2>
        <div className="shrink-0 flex items-center gap-1">
          <Info size={17} className="mx-1.5 max-[850px]:hidden" aria-hidden />
          <ToolbarButton label="Zoom out" disabled={zoomIndex === 0} onClick={() => setZoomIndex((i) => i - 1)}>
            <ZoomOut size={17} />
          </ToolbarButton>
          <ToolbarButton
            label="Zoom in"
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            onClick={() => setZoomIndex((i) => i + 1)}
          >
            <ZoomIn size={17} />
          </ToolbarButton>
          <Share size={17} className="mx-1.5 max-[850px]:hidden" aria-hidden />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-[#e9e9e6]">
        {zoom === 1 ? (
          <div className="size-full flex items-center-safe justify-center-safe p-4">
            <img src={src} alt={alt} draggable={false} className="block max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className="p-4" style={{ width: `${zoom * 100}%` }}>
            <img src={src} alt={alt} draggable={false} className="block w-full h-auto" />
          </div>
        )}
      </div>
    </section>
  );
}

function ToolbarButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-7 flex items-center justify-center rounded-md hover:bg-zinc-200/70 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-default"
    >
      {children}
    </button>
  );
}
