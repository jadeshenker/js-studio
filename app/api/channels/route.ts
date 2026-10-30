export const dynamic = "force-dynamic";

const ARENA_TIMEOUT_MS = 2000;
const ARENA_ATTEMPTS = 3;

async function fetchChannels() {
  // 896698 is me! 💖
  const response = await fetch("https://api.are.na/v2/users/896698/channels?per=100", {
    headers: {
      Authorization: `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(ARENA_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Are.na API error: ${response.status}`);
  }

  return response.json();
}

// Cold starts occasionally hit a slow or failed Are.na response, so retry before giving up
async function fetchChannelsWithRetry() {
  let lastError: unknown;
  for (let attempt = 1; attempt <= ARENA_ATTEMPTS; attempt++) {
    try {
      return await fetchChannels();
    } catch (error) {
      lastError = error;
      console.error(`Are.na fetch attempt ${attempt} failed:`, error);
    }
  }
  throw lastError;
}

export async function GET() {
  try {
    const data = await fetchChannelsWithRetry();

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
