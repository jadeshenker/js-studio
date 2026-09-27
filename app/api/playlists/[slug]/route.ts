export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to get access token: ${err.error || res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`https://api.spotify.com/v1/playlists/${slug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Spotify API error: ${err.error.message}`);
    }

    const playlist = await res.json();

    // the playlist object only embeds the first 100 tracks, and new songs are appended
    // to the end — so for longer playlists, swap in the last page to get the newest adds
    const tracks = playlist.tracks;
    if (tracks && tracks.total > tracks.items.length) {
      const offset = Math.max(0, tracks.total - 100);
      const lastPage = await fetch(`https://api.spotify.com/v1/playlists/${slug}/tracks?offset=${offset}&limit=100`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      if (lastPage.ok) playlist.tracks = await lastPage.json();
    }

    return new Response(JSON.stringify(playlist), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
