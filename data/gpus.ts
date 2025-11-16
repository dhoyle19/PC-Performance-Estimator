// data/gpus.ts
// Approximate GPU performance database.
// Scores are relative performance indices (higher = faster),
// loosely based on public benchmark hierarchies.
// You can safely replace/extend this later with auto-generated data.

export type GPU = {
  id: string;   // e.g. "rtx-4090"
  name: string; // e.g. "RTX 4090"
  score: number;
  vram: number; // GB
  tdp: number;  // W (approx)
};

export const gpus: GPU[] = [
  // --- Ada Lovelace (RTX 40 desktop) ---
  { id: "rtx-4090",        name: "RTX 4090",        score: 24000, vram: 24, tdp: 450 },
  { id: "rtx-4080-super",  name: "RTX 4080 Super",  score: 20500, vram: 16, tdp: 320 },
  { id: "rtx-4080",        name: "RTX 4080",        score: 19500, vram: 16, tdp: 320 },
  { id: "rtx-4070-ti-super", name: "RTX 4070 Ti Super", score: 17500, vram: 16, tdp: 285 },
  { id: "rtx-4070-ti",     name: "RTX 4070 Ti",     score: 16500, vram: 12, tdp: 285 },
  { id: "rtx-4070-super",  name: "RTX 4070 Super",  score: 15000, vram: 12, tdp: 220 },
  { id: "rtx-4070",        name: "RTX 4070",        score: 14000, vram: 12, tdp: 200 },
  { id: "rtx-4060-ti-16g", name: "RTX 4060 Ti 16GB",score: 12000, vram: 16, tdp: 165 },
  { id: "rtx-4060-ti",     name: "RTX 4060 Ti",     score: 11500, vram: 8,  tdp: 160 },
  { id: "rtx-4060",        name: "RTX 4060",        score: 9500,  vram: 8,  tdp: 115 },
  { id: "rtx-4050",        name: "RTX 4050",        score: 7500,  vram: 6,  tdp: 90  },

  // --- Ada (Laptop) ---
  { id: "rtx-4090-laptop", name: "RTX 4090 Laptop", score: 19000, vram: 16, tdp: 175 },
  { id: "rtx-4080-laptop", name: "RTX 4080 Laptop", score: 16500, vram: 12, tdp: 150 },
  { id: "rtx-4070-laptop", name: "RTX 4070 Laptop", score: 12500, vram: 8,  tdp: 115 },
  { id: "rtx-4060-laptop", name: "RTX 4060 Laptop", score: 9500,  vram: 8,  tdp: 90  },

  // --- RDNA 3 (RX 7000 desktop) ---
  { id: "rx-7900-xtx",     name: "RX 7900 XTX",     score: 22000, vram: 24, tdp: 355 },
  { id: "rx-7900-xt",      name: "RX 7900 XT",      score: 20500, vram: 20, tdp: 315 },
  { id: "rx-7900-gre",     name: "RX 7900 GRE",     score: 18500, vram: 16, tdp: 260 },
  { id: "rx-7800-xt",      name: "RX 7800 XT",      score: 16000, vram: 16, tdp: 263 },
  { id: "rx-7700-xt",      name: "RX 7700 XT",      score: 14000, vram: 12, tdp: 245 },
  { id: "rx-7600-xt",      name: "RX 7600 XT",      score: 11500, vram: 16, tdp: 190 },
  { id: "rx-7600",         name: "RX 7600",         score: 10000, vram: 8,  tdp: 165 },

  // --- RDNA 2 (RX 6000 desktop) ---
  { id: "rx-6950-xt",      name: "RX 6950 XT",      score: 18000, vram: 16, tdp: 335 },
  { id: "rx-6900-xt",      name: "RX 6900 XT",      score: 17000, vram: 16, tdp: 300 },
  { id: "rx-6800-xt",      name: "RX 6800 XT",      score: 15500, vram: 16, tdp: 300 },
  { id: "rx-6800",         name: "RX 6800",         score: 14000, vram: 16, tdp: 250 },
  { id: "rx-6750-xt",      name: "RX 6750 XT",      score: 13500, vram: 12, tdp: 250 },
  { id: "rx-6700-xt",      name: "RX 6700 XT",      score: 12500, vram: 12, tdp: 230 },
  { id: "rx-6650-xt",      name: "RX 6650 XT",      score: 11000, vram: 8,  tdp: 180 },
  { id: "rx-6600-xt",      name: "RX 6600 XT",      score: 10000, vram: 8,  tdp: 160 },
  { id: "rx-6600",         name: "RX 6600",         score: 9000,  vram: 8,  tdp: 132 },
  { id: "rx-6500-xt",      name: "RX 6500 XT",      score: 6500,  vram: 4,  tdp: 107 },

  // --- Ampere (RTX 30 desktop) ---
  { id: "rtx-3090-ti",     name: "RTX 3090 Ti",     score: 17500, vram: 24, tdp: 450 },
  { id: "rtx-3090",        name: "RTX 3090",        score: 16500, vram: 24, tdp: 350 },
  { id: "rtx-3080-ti",     name: "RTX 3080 Ti",     score: 16000, vram: 12, tdp: 350 },
  { id: "rtx-3080-12g",    name: "RTX 3080 12GB",   score: 15000, vram: 12, tdp: 350 },
  { id: "rtx-3080",        name: "RTX 3080",        score: 14500, vram: 10, tdp: 320 },
  { id: "rtx-3070-ti",     name: "RTX 3070 Ti",     score: 13000, vram: 8,  tdp: 290 },
  { id: "rtx-3070",        name: "RTX 3070",        score: 12000, vram: 8,  tdp: 220 },
  { id: "rtx-3060-ti",     name: "RTX 3060 Ti",     score: 11000, vram: 8,  tdp: 200 },
  { id: "rtx-3060-12g",    name: "RTX 3060 12GB",   score: 9000,  vram: 12, tdp: 170 },
  { id: "rtx-3050",        name: "RTX 3050",        score: 7000,  vram: 8,  tdp: 130 },

  // --- Ampere (Laptop) ---
  { id: "rtx-3080-laptop", name: "RTX 3080 Laptop", score: 13500, vram: 16, tdp: 150 },
  { id: "rtx-3070-laptop", name: "RTX 3070 Laptop", score: 11000, vram: 8,  tdp: 125 },
  { id: "rtx-3060-laptop", name: "RTX 3060 Laptop", score: 8500,  vram: 6,  tdp: 115 },

  // --- Turing (RTX 20 desktop) ---
  { id: "rtx-2080-ti",     name: "RTX 2080 Ti",     score: 12000, vram: 11, tdp: 260 },
  { id: "rtx-2080-super",  name: "RTX 2080 Super",  score: 10500, vram: 8,  tdp: 250 },
  { id: "rtx-2080",        name: "RTX 2080",        score: 10000, vram: 8,  tdp: 215 },
  { id: "rtx-2070-super",  name: "RTX 2070 Super",  score: 9000,  vram: 8,  tdp: 215 },
  { id: "rtx-2070",        name: "RTX 2070",        score: 8200,  vram: 8,  tdp: 175 },
  { id: "rtx-2060-super",  name: "RTX 2060 Super",  score: 7800,  vram: 8,  tdp: 175 },
  { id: "rtx-2060",        name: "RTX 2060",        score: 7000,  vram: 6,  tdp: 160 },

  // --- Pascal (GTX 10 desktop) ---
  { id: "gtx-1080-ti",     name: "GTX 1080 Ti",     score: 9000,  vram: 11, tdp: 250 },
  { id: "gtx-1080",        name: "GTX 1080",        score: 7800,  vram: 8,  tdp: 180 },
  { id: "gtx-1070-ti",     name: "GTX 1070 Ti",     score: 7200,  vram: 8,  tdp: 180 },
  { id: "gtx-1070",        name: "GTX 1070",        score: 6500,  vram: 8,  tdp: 150 },
  { id: "gtx-1060-6g",     name: "GTX 1060 6GB",    score: 5200,  vram: 6,  tdp: 120 },
  { id: "gtx-1060-3g",     name: "GTX 1060 3GB",    score: 4700,  vram: 3,  tdp: 120 },
  { id: "gtx-1050-ti",     name: "GTX 1050 Ti",     score: 3500,  vram: 4,  tdp: 75  },

  // --- Intel Arc (desktop) ---
  { id: "arc-a770-16g",    name: "Arc A770 16GB",   score: 11500, vram: 16, tdp: 225 },
  { id: "arc-a770-8g",     name: "Arc A770 8GB",    score: 11000, vram: 8,  tdp: 225 },
  { id: "arc-a750",        name: "Arc A750",        score: 9500,  vram: 8,  tdp: 225 },
  { id: "arc-a580",        name: "Arc A580",        score: 8000,  vram: 8,  tdp: 185 },
  { id: "arc-a380",        name: "Arc A380",        score: 5000,  vram: 6,  tdp: 75  },

  // --- Older midrange (for completeness) ---
  { id: "rx-580",          name: "RX 580",          score: 4000,  vram: 8,  tdp: 185 },
  { id: "rx-570",          name: "RX 570",          score: 3500,  vram: 4,  tdp: 150 },
  { id: "gtx-970",         name: "GTX 970",         score: 3800,  vram: 4,  tdp: 145 },
  { id: "gtx-960",         name: "GTX 960",         score: 2800,  vram: 2,  tdp: 120 },
];
