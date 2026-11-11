// app/api/most-recent-repo/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Content-Type": "application/json", "Cache-Control": "no-store" };

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const username = params.slug;

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: res.status, headers: noStoreHeaders });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: noStoreHeaders,
    });
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: noStoreHeaders,
    });
  }
}
