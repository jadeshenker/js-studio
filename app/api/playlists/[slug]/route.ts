export const dynamic = "force-dynamic";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const spotifyClient = SpotifyApi.withClientCredentials(
      `${process.env.SPOTIFY_CLIENT_ID}`,
      `${process.env.SPOTIFY_CLIENT_SECRET}`,
    );

    const playlist = await spotifyClient.playlists.getPlaylist(slug);

    return new Response(JSON.stringify(playlist), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
