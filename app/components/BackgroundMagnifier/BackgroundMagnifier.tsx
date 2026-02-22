"use client";

import React, { useState, useCallback, useRef } from "react";

const LENS_SIZE = 220;
const ZOOM = 2.8;

type BackgroundMagnifierProps = {
  backgroundSrc: string;
  enabled?: boolean;
  children: React.ReactNode;
};

export default function BackgroundMagnifier({
  backgroundSrc,
  enabled = true,
  children,
}: BackgroundMagnifierProps) {
  const [mouse, setMouse] = useState<{ viewportX: number; viewportY: number; localX: number; localY: number } | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
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
    },
    [enabled]
  );

  const handleMouseLeave = useCallback(() => {
    setMouse(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('${backgroundSrc}')` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {enabled && mouse && bounds.width > 0 && (
        <div
          className="pointer-events-none fixed z-50 rounded-full border-2 border-white/40 shadow-2xl ring-2 ring-black/20"
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
              backgroundImage: `url('${backgroundSrc}')`,
              backgroundSize: `${bounds.width * ZOOM}px ${bounds.height * ZOOM}px`,
              backgroundPosition: `${-(mouse.localX * ZOOM - LENS_SIZE / 2)}px ${-(mouse.localY * ZOOM - LENS_SIZE / 2)}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
