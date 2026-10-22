"use client";

import React, { useState } from "react";
import AboutMe from "@/components/AboutMe/AboutMe";
import Logs from "@/components/Logs/Logs";
import DesktopIcon from "@/components/Desktop/DesktopIcon";
import Finder from "@/components/Finder/Finder";
import TextEdit from "@/components/TextEdit/TextEdit";
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer";
import Preview from "@/components/Preview/Preview";
import { useLinkData } from "@/lib/links";

const DESKTOP_ICONS = [
  { id: "about", name: "about_me.txt", kind: "file" },
  { id: "links", name: "links", kind: "folder" },
  { id: "logs", name: "logs.txt", kind: "file" },
] as const;
type WindowId = (typeof DESKTOP_ICONS)[number]["id"] | "proof";

const DESKTOP_WINDOW_POSITIONS: Record<WindowId, React.CSSProperties> = {
  about: { left: "2.5rem", top: "2.5rem" },
  links: { left: "12rem", top: "9rem" },
  logs: { left: "calc(12rem + 48px)", top: "calc(9rem + 48px)" },
  proof: { left: "6rem", top: "4rem" },
};
const editorSize = "w-[min(36rem,calc(100%-5rem))] h-[28rem]";
const mobileWindowLayout =
  "max-[850px]:![transform:none] max-[850px]:!left-3 max-[850px]:!top-3 max-[850px]:w-[calc(100%-1.5rem)] max-[850px]:h-[70vh]";

export default function Page() {
  const { rows, activity, latestRepo, loading } = useLinkData();
  const [openWindowsBackToFront, setOpenWindows] = useState<WindowId[]>(["about"]);
  const [musicOpen, setMusicOpen] = useState(false);

  const bringToFront = (id: WindowId) => setOpenWindows((open) => [...open.filter((w) => w !== id), id]);
  const close = (id: WindowId) => setOpenWindows((open) => open.filter((w) => w !== id));

  return (
    <div className="relative h-screen min-h-0 bg-desktop flex overflow-hidden max-[850px]:h-auto max-[850px]:min-h-screen max-[850px]:flex-col max-[850px]:overflow-visible">
      <main className="relative flex-1 min-h-0 min-w-0 max-[850px]:flex-none max-[850px]:order-1 max-[850px]:h-[calc(70vh+1.5rem)]">
        {openWindowsBackToFront.map((id, i) => {
          const props = {
            onClose: () => close(id),
            onPointerDown: () => bringToFront(id),
            style: { zIndex: 10 + i, ...DESKTOP_WINDOW_POSITIONS[id] },
          };
          if (id === "proof") {
            return (
              <Preview
                key={id}
                title="PROOF.png"
                src="/images/PROOF.png"
                alt="an earlier version of this site, with the links in a finder window over a desktop full of screenshots"
                className={`absolute w-[min(48rem,calc(100%-8rem))] h-[38rem] ${mobileWindowLayout}`}
                {...props}
              />
            );
          }
          if (id === "links") {
            return (
              <Finder
                key={id}
                title="links"
                items={rows.map((row) => ({ name: row.name, modified: row.modifiedAt, type: "link", link: row.link }))}
                className={`absolute w-[min(44rem,calc(100%-14rem))] h-[22rem] ${mobileWindowLayout}`}
                {...props}
              />
            );
          }
          return (
            <TextEdit
              key={id}
              title={id === "about" ? "about_me.txt" : "logs.txt"}
              className={`absolute ${editorSize} ${mobileWindowLayout}`}
              {...props}
            >
              {id === "about" ? (
                <AboutMe latestRepo={latestRepo} onPlay={() => setMusicOpen(true)} onShowProof={() => bringToFront("proof")} />
              ) : (
                <Logs activity={activity} loading={loading} />
              )}
            </TextEdit>
          );
        })}
      </main>

      {musicOpen && <MusicPlayer onClose={() => setMusicOpen(false)} />}

      {/* after main so main's empty area doesn't sit on top of the icons */}
      <div className="absolute top-10 right-10 flex flex-col gap-3 max-[850px]:static max-[850px]:flex-row max-[850px]:px-3 max-[850px]:pt-3">
        {DESKTOP_ICONS.map(({ id, name, kind }) => (
          <DesktopIcon
            key={id}
            name={name}
            kind={kind}
            selected={openWindowsBackToFront.at(-1) === id}
            onOpen={() => bringToFront(id)}
          />
        ))}
      </div>
    </div>
  );
}
