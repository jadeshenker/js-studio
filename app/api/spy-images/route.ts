import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const entries = await readdir(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
      .map((e) => `/images/${e.name}`)
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json(files);
  } catch (err) {
    console.error("spy-images:", err);
    return NextResponse.json([] as string[], { status: 200 });
  }
}
