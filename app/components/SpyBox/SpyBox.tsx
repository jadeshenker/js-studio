"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const LENS_SIZE = 220;
const ZOOM = 2.8;

export default function SpyBox() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [mouse, setMouse] = useState<{
    viewportX: number;
    viewportY: number;
    localX: number;
    localY: number;
  } | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/spy-images")
      .then((res) => res.json())
      .then((paths: string[]) => {
        setImages(paths);
        setIndex(paths.length > 0 ? paths.length - 1 : 0);
      })
      .catch(() => setImages([]));
  }, []);

  const imageSrc = images.length > 0 ? images[index] : "";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const underCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (underCursor?.closest("[data-magnifier-ignore]")) {
      setMouse(null);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBounds({ width: rect.width, height: rect.height });
    setMouse({
      viewportX: e.clientX,
      viewportY: e.clientY,
      localX: e.clientX - rect.left,
      localY: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse(null);
  }, []);

  const goBack = useCallback(() => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
  }, [index]);

  const goForward = useCallback(() => {
    if (index >= images.length - 1) return;
    setIndex((i) => i + 1);
  }, [index, images.length]);

  const atFirst = index <= 0;
  const atLast = images.length === 0 || index >= images.length - 1;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="relative max-w-4xl w-full flex flex-col">
        <div
          className="flex items-center justify-start gap-2 w-full bg-zinc-50 p-1 rounded-t-sm border border-zinc-700 font-dm-mono"
          data-magnifier-ignore
        >
          <div className="flex items-center justify-start gap-1  ">
            <button
              type="button"
              onClick={goBack}
              disabled={atFirst}
              aria-label="Previous image"
              title="prev image"
              className="p-1 rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300/80 disabled:hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={goForward}
              disabled={atLast}
              aria-label="Next image"
              title="next image"
              className="p-1 rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300/80 disabled:hover:bg-transparent"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <span className="text-sm text-zinc-800 tracking-wide">play i spy</span>
        </div>

        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] max-h-[70vh] bg-zinc-200 cursor-crosshair overflow-hidden border border-t-0 border-zinc-700 rounded-b-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="" className="w-full h-full object-cover" draggable={false} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-dm-mono text-sm">No images</div>
          )}
        </div>
      </div>

      {/* Magnifier lens */}
      {mouse && bounds.width > 0 && imageSrc && (
        <div
          className="pointer-events-none fixed z-50 rounded-full overflow-hidden shadow-2xl"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: mouse.viewportX - LENS_SIZE / 2,
            top: mouse.viewportY - LENS_SIZE / 2,
          }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${imageSrc}')`,
              backgroundSize: `${bounds.width * ZOOM}px ${bounds.height * ZOOM}px`,
              backgroundPosition: `${-(mouse.localX * ZOOM - LENS_SIZE / 2)}px ${-(mouse.localY * ZOOM - LENS_SIZE / 2)}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
