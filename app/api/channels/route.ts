export async function GET() {
  try {
    // 896698 is me! 💖
    const response = await fetch("https://api.are.na/v2/users/896698/channels", {
      headers: {
        Authorization: `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

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
