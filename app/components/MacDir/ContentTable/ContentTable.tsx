"use client";

import React, { useEffect, useState } from "react";
import { Playlist } from "@spotify/web-api-ts-sdk";

interface Channel {
  added_to_at: string;
}

interface Repo {
  name: string;
  description?: string;
  updated_at: string;
}

interface Row {
  icon: string;
  alt: string;
  name: string;
  kind: string;
  modified: string;
  link: string;
  onClick?: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const d = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const t = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${d} at ${t}`;
};

const ContentTable = () => {
  const [arenaUpdatedAt, setArenaUpdatedAt] = useState<string | undefined>();
  const [playlistUpdatedAt, setPlaylistUpdatedAt] = useState<string | undefined>();
  const [ghUpdatedAt, setGhUpdatedAt] = useState<string | undefined>();

  useEffect(() => {
    fetch("/api/channels")
      .then((res) => res.json())
      .then((data) => {
        const channels = (data.channels as Channel[]) || [];
        const sortedChannels = channels.sort((a, b) =>
          a.added_to_at > b.added_to_at ? -1 : b.added_to_at > a.added_to_at ? 1 : 0,
        );

        setArenaUpdatedAt(sortedChannels[0].added_to_at);
      })
      .catch((err) => console.log(err));

    const playlistId = "4KVoTfuOy5plZd0jKVx8qs";
    fetch(`/api/playlists/${playlistId}`)
      .then((res) => res.json())
      .then((data) => {
        const playlistedTracks = (data as Playlist).tracks.items;
        const sortedTracks = playlistedTracks.sort((a, b) => (a.added_at > b.added_at ? -1 : b.added_at > a.added_at ? 1 : 0));

        setPlaylistUpdatedAt(sortedTracks[0].added_at);
      });

    fetch(`/api/user-repos/jadeshenker`)
      .then((res) => res.json())
      .then((data) => {
        const repos = (data as Repo[]) || [];
        const sortedRepos = repos.sort((a, b) => (a.updated_at > b.updated_at ? -1 : b.updated_at > a.updated_at ? 1 : 0));

        setGhUpdatedAt(sortedRepos[0].updated_at);
      });
  }, []);

  const rows: Row[] = [
    {
      icon: "💌",
      alt: "love letter",
      name: "are.na",
      kind: "link",
      modified: `${arenaUpdatedAt ? formatDate(arenaUpdatedAt) : "today, probably"}`,
      link: "https://www.are.na/jade-s-ewpvxvqauig/channels",
    },
    {
      icon: "🎧",
      alt: "headphones",
      name: "what i am listening to today",
      kind: "link",
      modified: `${playlistUpdatedAt ? formatDate(playlistUpdatedAt) : "today, probably"}`,
      link: "https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a",
      // onClick: () => openUrlViewer("https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a"),
    },
    {
      icon: "💾",
      alt: "floppy disk",
      name: "github",
      kind: "link",
      modified: `${ghUpdatedAt ? formatDate(ghUpdatedAt) : "last week, probably"}`,
      link: "https://github.com/jadeshenker",
    },
    {
      icon: "💀",
      alt: "skull",
      name: "linkedin (ick!)",
      kind: "link",
      modified: "probably wasn't 🖤",
      link: "https://www.linkedin.com/in/jadeshenker",
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 shadow-sm backdrop-blur-md font-dm-mono">
      {/* faux warp prompt */}
      <div className="drag-handle touch-none flex items-center justify-between gap-3 border-b border-zinc-800/70 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-xs text-zinc-400">
            <span className="text-zinc-300">jade</span>
            <span className="text-zinc-600">@</span>
            <span className="text-zinc-300">dev</span>
            <span className="text-zinc-600">:</span>
            <span className="text-zinc-300">~/links</span>
          </div>
        </div>
        {/* @todo re-add when urlviewer is implemented */}
        {/* <div className="shrink-0 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[11px] text-zinc-400">
          click to open • esc closes viewer
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2 font-normal">name</th>
              <th className="px-4 py-2 font-normal">date modified</th>
              <th className="px-4 py-2 font-normal">kind</th>
            </tr>
          </thead>

          <tbody className="text-sm text-zinc-100">
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-zinc-800/60 hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="opacity-90" role="img" aria-label={row.alt}>
                      {row.icon}
                    </span>

                    {row.kind === "link" && !row.onClick ? (
                      <a
                        target="_blank"
                        href={row.link}
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-md px-2 py-1 -mx-2 -my-1 text-zinc-100 hover:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-950"
                      >
                        <span className="underline decoration-zinc-700 underline-offset-4 group-hover:decoration-zinc-400">
                          {row.name}
                        </span>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400">↗</span>
                      </a>
                    ) : row.onClick ? (
                      <button
                        type="button"
                        onClick={row.onClick}
                        className="group inline-flex items-center gap-2 rounded-md px-2 py-1 -mx-2 -my-1 text-zinc-100 hover:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-zinc-950"
                      >
                        <span className="underline decoration-zinc-700 underline-offset-4 group-hover:decoration-zinc-400">
                          {row.name}
                        </span>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400">↩︎</span>
                      </button>
                    ) : (
                      <span>{row.name}</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-zinc-400">{row.modified}</td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-400">
                    {row.kind}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* subtle bottom fade like a terminal */}
      <div className="h-3 rounded-b-xl bg-gradient-to-b from-transparent to-zinc-950/30" />
    </div>
  );
};

export default ContentTable;
