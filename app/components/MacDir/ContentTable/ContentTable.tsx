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
}

/**
 * @param dateString datetime string
 * @returns formatted date, ie "May 14, 2025 at 11:29 PM"
 */
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
      kind: "hyperlink",
      modified: `${arenaUpdatedAt ? formatDate(arenaUpdatedAt) : "today, probably"}`,
      link: "https://www.are.na/jade-s-ewpvxvqauig/channels",
    },
    {
      icon: "🎧",
      alt: "headphones",
      name: "what i am listening to today",
      kind: "hyperlink",
      modified: `${playlistUpdatedAt ? formatDate(playlistUpdatedAt) : "today, probably"}`,
      link: "https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a",
    },
    {
      icon: "💾",
      alt: "floppy disk",
      name: "github",
      kind: "hyperlink",
      modified: `${ghUpdatedAt ? formatDate(ghUpdatedAt) : "last week, probably"}`,
      link: "https://github.com/jadeshenker",
    },
    {
      icon: "💀",
      alt: "skull",
      name: "linkedin (ick!)",
      kind: "hyperlink",
      modified: "probably wasn't 🖤",
      link: "https://www.linkedin.com/in/jadeshenker",
    },
  ];

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr className="text-left text-zinc-500 text-sm border-t border-t-zinc-200 border-b border-b-zinc-200">
          <th className="font-normal px-4 py-2">Name</th>
          <th className="px-4 py-2">Date Modified</th>
          <th className="font-normal px-4 py-2">Kind</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={`${i % 2 === 1 ? "bg-zinc-100" : ""} rounded-md text-sm text-zinc-800`}>
            <td className="px-4 py-3">
              <div className="flex flex-row align-center">
                <span className="pr-2 block" role="img" aria-label={row.alt}>
                  {row.icon}
                </span>
                {row.kind === "hyperlink" ? (
                  <a
                    target="_blank"
                    href={row.link}
                    className="block text-[#1B0DF8]  hover:bg-[#1B0DF8] hover:text-white transition"
                    rel="noreferrer"
                  >
                    {row.name}
                  </a>
                ) : (
                  row.name
                )}
              </div>
            </td>
            <td className="px-4 py-3 text-zinc-500">{row.modified}</td>
            <td className="pl-4 pr-6 py-3 text-zinc-500">{row.kind}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContentTable;
