"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Square, SquareCheck } from "lucide-react";
import { DEFAULT_RADIUS, SPY_CLUES, type SpyClue } from "@/lib/spyClues";

const LENS_SIZE = 220;
const SPOT_PINK = "#d946ef";
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
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  // keyed `${imageName}|${clueIndex}|${spotIndex}`, so each image keeps its own progress
  const [found, setFound] = useState<Record<string, true>>({});
  const [editMode, setEditMode] = useState(false);
  const [lastClick, setLastClick] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setEditMode(new URLSearchParams(window.location.search).has("spyedit"));
  }, []);

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
  // images are named like background_2026.png
  const imageYear = imageSrc.match(/\d{4}/)?.[0];

  // Mirror object-cover: scale to fill the container, centered, preserving aspect ratio
  const coverScale =
    natural.width > 0 && natural.height > 0 ? Math.max(bounds.width / natural.width, bounds.height / natural.height) : 0;
  const rendered = coverScale ? { width: natural.width * coverScale, height: natural.height * coverScale } : bounds;
  const offsetX = (bounds.width - rendered.width) / 2;
  const offsetY = (bounds.height - rendered.height) / 2;

  const imageName = imageSrc.split("/").pop() ?? "";
  const clues = (SPY_CLUES[imageName] ?? []).map((clue, index) => ({ ...clue, index })).filter((clue) => clue.spots.length > 0);
  const spotKey = (clueIndex: number, spotIndex: number) => `${imageName}|${clueIndex}|${spotIndex}`;
  const needed = (clue: SpyClue) => Math.min(clue.count ?? 1, clue.spots.length);
  const foundIn = (clue: SpyClue & { index: number }) => clue.spots.filter((_, s) => found[spotKey(clue.index, s)]).length;
  const allFound = clues.length > 0 && clues.every((clue) => foundIn(clue) >= needed(clue));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (natural.width === 0) return;
    // measure fresh: the box can resize without a mouse move (e.g. when the clue list wraps)
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = Math.max(rect.width / natural.width, rect.height / natural.height);
    const coverWidth = natural.width * scale;
    const coverHeight = natural.height * scale;
    // container px → fraction of the full (uncropped) image
    const x = (e.clientX - rect.left - (rect.width - coverWidth) / 2) / coverWidth;
    const y = (e.clientY - rect.top - (rect.height - coverHeight) / 2) / coverHeight;
    const aspect = natural.height / natural.width;

    if (editMode) {
      const point = { x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) };
      setLastClick(point);
      console.log(`{ x: ${point.x}, y: ${point.y} }`);
    }

    for (const clue of clues) {
      if (foundIn(clue) >= needed(clue)) continue;
      const hit = clue.spots.findIndex(
        (spot, s) =>
          !found[spotKey(clue.index, s)] && Math.hypot(x - spot.x, (y - spot.y) * aspect) <= (spot.r ?? DEFAULT_RADIUS),
      );
      if (hit !== -1) {
        setFound((prev) => ({ ...prev, [spotKey(clue.index, hit)]: true }));
        return;
      }
    }
  };

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
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] max-[850px]:min-h-0 max-[850px]:w-full p-6 max-[850px]:p-3">
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
          onClick={handleClick}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
              onLoad={(e) =>
                setNatural({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                })
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-dm-mono text-sm">No images</div>
          )}

          {/* spot markers in image pixels; "slice" crops exactly like object-cover */}
          {natural.width > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full"
              viewBox={`0 0 ${natural.width} ${natural.height}`}
              preserveAspectRatio="xMidYMid slice"
            >
              {clues.flatMap((clue) =>
                clue.spots.map((spot, s) => {
                  const isFound = found[spotKey(clue.index, s)];
                  if (!isFound && !editMode) return null;
                  const cx = spot.x * natural.width;
                  const cy = spot.y * natural.height;
                  const r = (spot.r ?? DEFAULT_RADIUS) * natural.width;
                  return (
                    <g key={spotKey(clue.index, s)}>
                      {isFound ? (
                        <rect
                          x={cx - r}
                          y={cy - r}
                          width={r * 2}
                          height={r * 2}
                          fill="none"
                          stroke={SPOT_PINK}
                          strokeWidth={3}
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="none"
                          stroke={SPOT_PINK}
                          strokeWidth={3}
                          strokeDasharray="6 4"
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                      {editMode && (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={natural.width * 0.012}
                          fill="#d946ef"
                          stroke="white"
                          strokeWidth={natural.width * 0.003}
                          paintOrder="stroke"
                          className="font-dm-mono"
                        >
                          {clue.label}
                        </text>
                      )}
                    </g>
                  );
                }),
              )}
            </svg>
          )}
        </div>

        {imageSrc && (
          <div className="pt-2 px-1 text-center font-dm-mono text-[10px] text-zinc-500">
            {imageYear ? `my desktop, ${imageYear}` : "my desktop"} · {index + 1} of {images.length}
          </div>
        )}

        {editMode && (
          <div className="pt-1 px-1 font-dm-mono text-[10px] text-fuchsia-600">
            spyedit: click the image to get coordinates{" "}
            {lastClick && <code className="bg-fuchsia-100 px-1">{`{ x: ${lastClick.x}, y: ${lastClick.y} }`}</code>}
          </div>
        )}

        {clues.length > 0 && (
          <div className="pt-3 px-1 font-dm-mono text-xs text-zinc-800">
            <div className="pb-1.5 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold">
              {allFound ? "you found everything <3" : "i spy..."}
            </div>
            <ul className="list-none pl-0 m-0 flex flex-wrap gap-x-5 gap-y-1.5">
              {clues.map((clue) => {
                const count = foundIn(clue);
                const done = count >= needed(clue);
                return (
                  <li key={clue.index} className={`flex items-center gap-1.5 ${done ? "text-zinc-400 line-through" : ""}`}>
                    {done ? (
                      <SquareCheck size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
                    ) : (
                      <Square size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
                    )}
                    {clue.label}
                    {needed(clue) > 1 && (
                      <span className="text-zinc-500 text-[10px]">
                        {" "}
                        {count}/{needed(clue)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
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
            className="w-full h-full rounded-full overflow-hidden bg-no-repeat"
            style={{
              backgroundImage: `url('${imageSrc}')`,
              backgroundSize: `${rendered.width * ZOOM}px ${rendered.height * ZOOM}px`,
              backgroundPosition: `${-((mouse.localX - offsetX) * ZOOM - LENS_SIZE / 2)}px ${-((mouse.localY - offsetY) * ZOOM - LENS_SIZE / 2)}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
