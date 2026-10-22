export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 896698 is me! 💖
    const response = await fetch("https://api.are.na/v2/users/896698/channels?per=100", {
      headers: {
        Authorization: `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Are.na API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
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
