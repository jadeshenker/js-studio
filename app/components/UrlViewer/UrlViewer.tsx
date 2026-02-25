"use client";

import React, { useEffect, useId, useRef } from "react";
import { ExternalLink, Copy, X } from "lucide-react";

const BRAT_GREEN = "#B8FF3B";

const URL = "https://open.spotify.com/embed/playlist/4KVoTfuOy5plZd0jKVx8qs?utm_source=generator&theme=0";

type UrlViewerProps = {
  visible: boolean;
  onClose: () => void;
};

export default function UrlViewer({ visible, onClose }: UrlViewerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, onClose]);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const handleOpen = () => {
    window.open(URL, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(URL);
    } catch {
      console.warn("Failed to copy link");
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={titleId} data-magnifier-ignore>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div className="absolute bottom-3 right-3">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="w-[420px] max-w-[calc(100vw-24px)] rounded-md border border-zinc-800/80 bg-zinc-900/98 px-4 py-3 shadow-sm backdrop-blur-md font-dm-mono outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
        >
          {/* Header */}
          <div className="mb-3">
            <div id={titleId} className="text-xs uppercase tracking-wide text-zinc-400">
              url_viewer
            </div>
            <div className="truncate text-[11px] text-zinc-500">open.spotify.com</div>
          </div>

          {/* Iframe */}
          <div className="overflow-hidden rounded-xl border border-zinc-800/70">
            <iframe
              data-testid="embed-iframe"
              src={URL}
              width="100%"
              height="352"
              frameBorder={0}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>

          {/* Actions — terminal style */}
          <div className="mt-3 flex items-center gap-2 border-t border-zinc-800/70 pt-3">
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
              style={{ borderColor: BRAT_GREEN, color: BRAT_GREEN }}
            >
              open
              <ExternalLink size={12} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
            >
              copy link
              <Copy size={12} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-900"
            >
              exit
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
