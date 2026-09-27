/**
 * Things to find in each spy image, keyed by filename.
 *
 * Spot coordinates are fractions of the full image (0–1), so they survive resizing.
 * `r` is the click radius as a fraction of image width (defaults to DEFAULT_RADIUS).
 * `count` is how many of the clue's spots must be found; it's capped at spots.length,
 * and clues with no spots yet are hidden. Open the site with ?spyedit to see every
 * spot and get coordinates for new ones by clicking.
 *
 * Note: object-cover crops ~12% off each side of these images in the 4:3 box,
 * so spots need x between ~0.12 and ~0.88 to be visible.
 */

export interface SpySpot {
  x: number;
  y: number;
  r?: number;
}

export interface SpyClue {
  label: string;
  count?: number;
  spots: SpySpot[];
}

export const DEFAULT_RADIUS = 0.03;

export const SPY_CLUES: Record<string, SpyClue[]> = {
  "background_2025.png": [
    { label: "the sims", spots: [{ x: 0.212, y: 0.305 }] },
    {
      label: "my cats",
      count: 2,
      spots: [
        { x: 0.46, y: 0.742, r: 0.04 },
        { x: 0.395, y: 0.812 },
        { x: 0.672, y: 0.809 },
      ],
    },
    {
      label: "the park",
      count: 3,
      spots: [
        { x: 0.396, y: 0.167 },
        { x: 0.395, y: 0.294 },
        { x: 0.582, y: 0.42 },
        { x: 0.582, y: 0.69 },
      ],
    },
    {
      label: "charli xcx",
      count: 2,
      spots: [
        { x: 0.303, y: 0.683 },
        { x: 0.67, y: 0.563, r: 0.04 },
      ],
    },
    {
      label: "maya man's on the hour",
      spots: [
        { x: 0.507, y: 0.063 },
        { x: 0.766, y: 0.046 },
      ],
    },
    { label: "gabbriette", spots: [{ x: 0.351, y: 0.565 }] },
  ],
  "background_2026.png": [
    {
      label: "jade",
      count: 2,
      spots: [
        { x: 0.693, y: 0.314 },
        { x: 0.486, y: 0.68 }, // tattoo on the hand in IMG_6622
      ],
    },
    { label: "my lil pony", spots: [{ x: 0.497, y: 0.055 }] },
    {
      label: "hearts",
      count: 3,
      spots: [
        { x: 0.701, y: 0.2 },
        { x: 0.693, y: 0.851 },
        { x: 0.866, y: 0.189, r: 0.02 },
      ],
    },
    { label: "my bestie's logo", spots: [{ x: 0.59, y: 0.696 }] },
    { label: "cleo, my cat", spots: [{ x: 0.505, y: 0.835 }] },
    { label: "cleo, from h2o", spots: [{ x: 0.675, y: 0.06 }] },
  ],
};
