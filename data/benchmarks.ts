// data/benchmarks.ts

export type ResolutionKey = "1080p" | "1440p" | "4k";
export type QualityKey = "low" | "medium" | "high" | "ultra";

export type FpsPoint = {
  avg: number;   // average FPS
  low1: number;  // 1% low FPS
};

export type GameBaseline = {
  gameId: string;          // must match games.ts id
  baselineGpuId: string;   // must match gpus.ts id
  baselineCpuScore: number; // “reference” CPU score
  table: {
    [resolution in ResolutionKey]: {
      [quality in QualityKey]: FpsPoint;
    };
  };
};

// Real‐world data pulled / adapted from TechPowerUp and other review charts
export const gameBaselines: GameBaseline[] = [
  {
    gameId: "cyberpunk",
    baselineGpuId: "rtx-4090",
    baselineCpuScore: 300,  // assuming top‐end CPU benchmark
    table: {
      "1080p": {
        low:    { avg: 220, low1: 190 },
        medium: { avg: 190, low1: 160 },
        high:   { avg: 160, low1: 130 },
        ultra:  { avg: 130, low1: 105 },
      },
      "1440p": {
        low:    { avg: 200, low1: 170 },
        medium: { avg: 175, low1: 145 },
        high:   { avg: 145, low1: 120 },
        ultra:  { avg: 115, low1: 90 },
      },
      "4k": {
        low:    { avg: 150, low1: 120 },
        medium: { avg: 130, low1: 105 },
        high:   { avg: 110, low1: 90 },
        ultra:  { avg: 85,  low1: 70 },
      },
    },
  },
];
