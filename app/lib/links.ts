"use client";

import { useEffect, useState } from "react";
import type { Playlist } from "@spotify/web-api-ts-sdk";

interface Channel {
  added_to_at: string;
}

interface Repo {
  name: string;
  description?: string;
  updated_at: string;
}

export interface LinkRow {
  icon: string;
  alt: string;
  name: string;
  kind: string;
  modifiedAt: string;
  /** Short date for tag, e.g. "Mar 8, 2026" */
  modifiedAtShort?: string;
  link: string;
}

function formatDate(dateString: string): string {
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
}

/** Short form for tag display, e.g. "Mar 8, 2026" */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function useLinkRows(): LinkRow[] {
  const [arenaUpdatedAt, setArenaUpdatedAt] = useState<string | undefined>();
  const [playlistUpdatedAt, setPlaylistUpdatedAt] = useState<string | undefined>();
  const [ghUpdatedAt, setGhUpdatedAt] = useState<string | undefined>();

  useEffect(() => {
    fetch("/api/channels")
      .then((res) => res.json())
      .then((data) => {
        const channels = (data.channels as Channel[]) || [];
        const sorted = channels.sort((a, b) => (a.added_to_at > b.added_to_at ? -1 : b.added_to_at > a.added_to_at ? 1 : 0));
        setArenaUpdatedAt(sorted[0]?.added_to_at);
      })
      .catch(() => {});

    fetch("/api/playlists/4KVoTfuOy5plZd0jKVx8qs")
      .then((res) => res.json())
      .then((data) => {
        const items = (data as Playlist).tracks?.items ?? [];
        const sorted = items.sort((a, b) => (a.added_at > b.added_at ? -1 : b.added_at > a.added_at ? 1 : 0));
        setPlaylistUpdatedAt(sorted[0]?.added_at);
      })
      .catch(() => {});

    fetch("/api/user-repos/jadeshenker")
      .then((res) => res.json())
      .then((data) => {
        const repos = (data as Repo[]) || [];
        const sorted = repos.sort((a, b) => (a.updated_at > b.updated_at ? -1 : b.updated_at > a.updated_at ? 1 : 0));
        setGhUpdatedAt(sorted[0]?.updated_at);
      })
      .catch(() => {});
  }, []);

  return [
    {
      icon: "💌",
      alt: "love letter",
      name: "are.na",
      kind: "hyperlink",
      modifiedAt: arenaUpdatedAt ? formatDate(arenaUpdatedAt) : "today, probably",
      modifiedAtShort: arenaUpdatedAt ? formatDateShort(arenaUpdatedAt) : "—",
      link: "https://www.are.na/jade-s-d2yaygzp528/channels",
    },
    {
      icon: "🎧",
      alt: "headphones",
      name: "what i am listening to today",
      kind: "hyperlink",
      modifiedAt: playlistUpdatedAt ? formatDate(playlistUpdatedAt) : "today, probably",
      modifiedAtShort: playlistUpdatedAt ? formatDateShort(playlistUpdatedAt) : "—",
      link: "https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a",
    },
    {
      icon: "💾",
      alt: "floppy disk",
      name: "github",
      kind: "hyperlink",
      modifiedAt: ghUpdatedAt ? formatDate(ghUpdatedAt) : "last week, probably",
      modifiedAtShort: ghUpdatedAt ? formatDateShort(ghUpdatedAt) : "—",
      link: "https://github.com/jadeshenker",
    },
    {
      icon: "💀",
      alt: "skull",
      name: "linkedin, if u must!",
      kind: "hyperlink",
      modifiedAt: "probably wasn't 🖤",
      link: "https://www.linkedin.com/in/jadeshenker",
    },
  ];
}
