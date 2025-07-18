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
    spotifyClient.getAccessToken().then((t) => console.log("expires:", t?.expires, "expires in:", t?.expires_in));
    return new Response(JSON.stringify(playlist), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
