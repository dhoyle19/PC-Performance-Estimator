// data/games.ts

export type Game = {
  id: string;
  name: string;
  baseFps1080: number;    // baseline FPS for a "reference" combo
  scale1440: number;      // 1440p / 1080p FPS factor
  scale4k: number;        // 4K / 1080p FPS factor
  gpuWeight: number;      // contribution of GPU
  cpuWeight: number;      // contribution of CPU
};

export const games: Game[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    baseFps1080: 60,
    scale1440: 0.75,
    scale4k: 0.48,
    gpuWeight: 0.75,
    cpuWeight: 0.25,
  },
  {
    id: "fortnite",
    name: "Fortnite",
    baseFps1080: 160,
    scale1440: 0.78,
    scale4k: 0.52,
    gpuWeight: 0.6,
    cpuWeight: 0.4,
  },
  {
    id: "eldenring",
    name: "Elden Ring",
    baseFps1080: 80,
    scale1440: 0.77,
    scale4k: 0.5,
    gpuWeight: 0.7,
    cpuWeight: 0.3,
  },
];
