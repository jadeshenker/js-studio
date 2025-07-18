// app/api/most-recent-repo/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const username = params.slug;

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      cache: "no-cache",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: res.status });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
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
