"use client";

import React, { useRef, useState } from "react";

const MIN_ONSCREEN_X = 80;
const MIN_ONSCREEN_Y = 40;

export function useDraggable({ disabled = false } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    const win = ref.current;
    if (disabled || !win || e.button !== 0 || window.matchMedia("(max-width: 850px)").matches) return;
    if ((e.target as Element).closest("button, a, input, select, label")) return;
    e.preventDefault();

    const start = { px: e.clientX, py: e.clientY, ...offset };
    const rect = win.getBoundingClientRect();
    const desk = (win.offsetParent ?? document.body).getBoundingClientRect();
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const onMove = (ev: PointerEvent) => {
      const dx = clamp(ev.clientX - start.px, desk.left - rect.right + MIN_ONSCREEN_X, desk.right - rect.left - MIN_ONSCREEN_X);
      const dy = clamp(ev.clientY - start.py, desk.top - rect.top, desk.bottom - rect.top - MIN_ONSCREEN_Y);
      setOffset({ x: start.x + dx, y: start.y + dy });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return {
    ref,
    handleProps: { onPointerDown },
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` } satisfies React.CSSProperties,
  };
}
