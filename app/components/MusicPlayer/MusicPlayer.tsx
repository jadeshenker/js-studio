"use client";

import React, { useEffect, useRef, useState } from "react";
import { FastForward, Pause, Play, Repeat, Rewind, Volume1, Volume2 } from "lucide-react";
import TrafficLights from "@/components/Window/TrafficLights";
import { useDraggable } from "@/components/Window/useDraggable";

const VIDEO_ID = "afhy9n3e-uQ";
const SKIP_SECONDS = 10;
const ARTWORK = `https://i.ytimg.com/vi/${VIDEO_ID}/mqdefault.jpg`;

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVolume(): number;
  setVolume(volume: number): void;
  unMute(): void;
  getVideoData(): { title?: string };
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      width: number;
      height: number;
      playerVars: Record<string, number>;
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_ENDED = 0;
const YT_PLAYING = 1;

let ytReady: Promise<YTNamespace> | undefined;
function loadYouTube() {
  ytReady ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return ytReady;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export default function MusicPlayer({ onClose }: { onClose: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [song, setSong] = useState<{ title: string; artist?: string }>();
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [volume, setVolume] = useState(100);
  const [repeat, setRepeat] = useState(false);
  const repeatForCallbacks = useRef(repeat);
  repeatForCallbacks.current = repeat;
  const isScrubbing = useRef(false);
  const drag = useDraggable();

  useEffect(() => {
    let cancelled = false;
    loadYouTube().then((YT) => {
      if (cancelled || !hostRef.current) return;
      // YouTube replaces this node with its iframe, so React must not own it
      const target = document.createElement("div");
      hostRef.current.appendChild(target);
      playerRef.current = new YT.Player(target, {
        videoId: VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: { autoplay: 1, controls: 0, playsinline: 1 },
        events: {
          onReady: ({ target: player }) => {
            const [artist, ...rest] = (player.getVideoData().title ?? "").split(" - ");
            setSong(rest.length ? { title: rest.join(" - "), artist } : { title: artist });
            setVolume(player.getVolume());
            player.playVideo();
          },
          onStateChange: ({ data }) => {
            setPlaying(data === YT_PLAYING);
            if (data === YT_ENDED && repeatForCallbacks.current) {
              playerRef.current?.seekTo(0, true);
              playerRef.current?.playVideo();
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime || isScrubbing.current) return;
      setTime({ current: player.getCurrentTime(), duration: player.getDuration() });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const player = () => (playerRef.current?.getCurrentTime ? playerRef.current : null);
  const togglePlay = () => (playing ? player()?.pauseVideo() : player()?.playVideo());
  const seekTo = (seconds: number) => {
    player()?.seekTo(clamp(seconds, 0, time.duration), true);
    setTime((t) => ({ ...t, current: clamp(seconds, 0, t.duration) }));
  };
  const changeVolume = (value: number) => {
    player()?.unMute();
    player()?.setVolume(value);
    setVolume(value);
  };

  return (
    <div
      ref={drag.ref as React.RefObject<HTMLDivElement>}
      role="region"
      aria-label="Music player"
      style={drag.style}
      className="fixed z-[100] inset-x-0 mx-auto bottom-10 w-[min(38rem,calc(100%-1.5rem))] max-[850px]:bottom-3 max-[850px]:![transform:none] select-none font-[-apple-system,BlinkMacSystemFont,sans-serif] text-zinc-800"
    >
      <div ref={hostRef} className="absolute size-px opacity-0 pointer-events-none overflow-hidden" aria-hidden />

      <div
        {...drag.handleProps}
        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-300 bg-[linear-gradient(to_bottom,#fafaf8,#ecece9)] shadow-[0_20px_60px_-10px_rgb(0_0_0/0.35)]"
      >
        <TrafficLights onClose={onClose} vertical />

        <img
          src={ARTWORK}
          alt=""
          draggable={false}
          className="shrink-0 size-16 rounded-md object-cover border border-black/10 shadow-sm max-[850px]:hidden"
        />

        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <RoundButton label={`Back ${SKIP_SECONDS} seconds`} onClick={() => seekTo(time.current - SKIP_SECONDS)}>
              <Rewind size={14} fill="currentColor" strokeWidth={0} />
            </RoundButton>
            <RoundButton label={playing ? "Pause" : "Play"} onClick={togglePlay} large>
              {playing ? (
                <Pause size={18} fill="currentColor" strokeWidth={0} />
              ) : (
                <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
              )}
            </RoundButton>
            <RoundButton label={`Forward ${SKIP_SECONDS} seconds`} onClick={() => seekTo(time.current + SKIP_SECONDS)}>
              <FastForward size={14} fill="currentColor" strokeWidth={0} />
            </RoundButton>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 max-[850px]:hidden">
            <Volume1 size={13} aria-hidden />
            <input
              type="range"
              aria-label="Volume"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="player-range w-20"
            />
            <Volume2 size={13} aria-hidden />
          </div>
        </div>

        <div className="flex-1 min-w-0 h-16 flex flex-col justify-center gap-1 px-3 rounded-lg border border-[#c9cbb4] bg-[linear-gradient(to_bottom,#f6f7ea,#e9ebd4)] shadow-[inset_0_1px_3px_rgb(0_0_0/0.12)]">
          <div className="relative text-center leading-tight" aria-live="polite">
            <p className="m-0 truncate text-[13px] font-semibold">{song?.title ?? "loading…"}</p>
            <p className="m-0 truncate text-[12px] text-zinc-600">{song?.artist ?? "\u00a0"}</p>
            <button
              type="button"
              onClick={() => setRepeat((r) => !r)}
              aria-label="Repeat"
              aria-pressed={repeat}
              className={`absolute right-0 top-1/2 -translate-y-1/2 flex ${repeat ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-500"}`}
            >
              <Repeat size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] tabular-nums text-zinc-600">
            <span>{formatTime(time.current)}</span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={time.duration || 1}
              step={0.1}
              value={time.current}
              onPointerDown={() => (isScrubbing.current = true)}
              onPointerUp={() => (isScrubbing.current = false)}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="player-range flex-1 min-w-0"
            />
            <span>{formatTime(time.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundButton({
  label,
  onClick,
  large = false,
  children,
}: {
  label: string;
  onClick: () => void;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${large ? "size-10" : "size-8"} rounded-full flex items-center justify-center text-zinc-600 border border-zinc-300 bg-[linear-gradient(to_bottom,#ffffff,#e8e8e5)] shadow-[0_1px_2px_rgb(0_0_0/0.12),inset_0_1px_0_#fff] hover:text-zinc-800 active:bg-[linear-gradient(to_bottom,#e4e4e1,#f2f2f0)]`}
    >
      {children}
    </button>
  );
}
