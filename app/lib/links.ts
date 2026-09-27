"use client";

import { useEffect, useState } from "react";
import type { Playlist } from "@spotify/web-api-ts-sdk";

interface Channel {
  title: string;
  slug: string;
  owner_slug: string;
  status: string;
  added_to_at: string;
}

export interface Repo {
  name: string;
  description?: string;
  html_url: string;
  fork: boolean;
  pushed_at: string;
}

export interface LinkRow {
  icon: string;
  alt: string;
  name: string;
  kind: string;
  modifiedAt: string;
  /** Short date for tag, e.g. "Mar 8" */
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

/** Short form for tag display, e.g. "Mar 8" this year, "Mar 8, 2025" otherwise */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
}

/** Shared between the link rows and the activity log */
const ICONS = { arena: "💌", spotify: "🎧", github: "💾" };

export interface ActivityEntry {
  icon: string;
  date: string;
  action: string;
  target: string;
  link: string;
}

export const ACTIVITY_LIMIT = 8;

const byDateDesc =
  <T>(key: (item: T) => string) =>
  (a: T, b: T) =>
    key(b).localeCompare(key(a));

/** Spotify adds are grouped per day so one listening session reads as one entry */
function playlistActivity(playlist: Playlist): ActivityEntry[] {
  const byDay = new Map<string, string[]>();
  for (const { added_at } of playlist.tracks?.items ?? []) {
    if (!added_at) continue;
    const day = new Date(added_at).toDateString();
    byDay.set(day, [...(byDay.get(day) ?? []), added_at]);
  }
  return Array.from(byDay.values()).map((dates) => ({
    date: dates.sort().at(-1)!,
    icon: ICONS.spotify,
    action: dates.length === 1 ? "added a song to" : `added ${dates.length} songs to`,
    target: playlist.name,
    link: playlist.external_urls.spotify,
  }));
}

function buildActivity(channels: Channel[], playlist: Playlist | undefined, repos: Repo[]): ActivityEntry[] {
  return [
    ...channels
      .filter((c) => c.status !== "private" && c.added_to_at)
      .map((c) => ({
        date: c.added_to_at,
        icon: ICONS.arena,
        action: "added to are.na channel",
        target: c.title,
        link: `https://www.are.na/${c.owner_slug}/${c.slug}`,
      })),
    ...(playlist ? playlistActivity(playlist) : []),
    ...repos
      .filter((r) => !r.fork && r.pushed_at)
      .map((r) => ({
        date: r.pushed_at,
        icon: ICONS.github,
        action: "committed to",
        target: r.name,
        link: r.html_url,
      })),
  ]
    .sort(byDateDesc((e) => e.date))
    .slice(0, ACTIVITY_LIMIT);
}

export interface LinkData {
  rows: LinkRow[];
  activity: ActivityEntry[];
  /** Most recently pushed non-fork repo */
  latestRepo?: Repo;
  /** True until every source has responded (or failed) */
  loading: boolean;
}

export function useLinkData(): LinkData {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | undefined>();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/channels")
        .then((res) => res.json())
        .then((data) => setChannels((data.channels as Channel[]) || [])),
      fetch("/api/playlists/4KVoTfuOy5plZd0jKVx8qs")
        .then((res) => res.json())
        .then((data) => !data.error && setPlaylist(data as Playlist)),
      fetch("/api/user-repos/jadeshenker")
        .then((res) => res.json())
        .then((data) => Array.isArray(data) && setRepos(data as Repo[])),
    ]).then(() => setLoading(false));
  }, []);

  const arenaUpdatedAt = channels
    .map((c) => c.added_to_at)
    .sort()
    .at(-1);
  const playlistUpdatedAt = playlist?.tracks?.items
    .map((i) => i.added_at)
    .sort()
    .at(-1);
  const ghUpdatedAt = repos
    .map((r) => r.pushed_at)
    .sort()
    .at(-1);

  const rows: LinkRow[] = [
    {
      icon: ICONS.arena,
      alt: "love letter",
      name: "are.na",
      kind: "hyperlink",
      modifiedAt: arenaUpdatedAt ? formatDate(arenaUpdatedAt) : "today, probably",
      modifiedAtShort: arenaUpdatedAt ? formatDateShort(arenaUpdatedAt) : "—",
      link: "https://www.are.na/jade-s-d2yaygzp528/channels",
    },
    {
      icon: ICONS.spotify,
      alt: "headphones",
      name: "what i am listening to today",
      kind: "hyperlink",
      modifiedAt: playlistUpdatedAt ? formatDate(playlistUpdatedAt) : "today, probably",
      modifiedAtShort: playlistUpdatedAt ? formatDateShort(playlistUpdatedAt) : "—",
      link: "https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a",
    },
    {
      icon: ICONS.github,
      alt: "floppy disk",
      name: "github",
      kind: "hyperlink",
      modifiedAt: ghUpdatedAt ? formatDate(ghUpdatedAt) : "last week, probably",
      modifiedAtShort: ghUpdatedAt ? formatDateShort(ghUpdatedAt) : "—",
      link: "https://github.com/jadeshenker",
    },
    {
      icon: "🎸",
      alt: "ROCKKKKK music",
      name: "1-800-I-LOVE-MUSIC",
      kind: "hyperlink",
      modifiedAt: "",
      link: "https://www.1-800-i-love-music.com",
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

  const latestRepo = repos.filter((r) => !r.fork).sort(byDateDesc((r) => r.pushed_at))[0];

  return { rows, activity: buildActivity(channels, playlist, repos), latestRepo, loading };
}
