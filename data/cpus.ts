// data/cpus.ts
// Approximate CPU performance database.
// Scores are relative indices (higher = faster),
// loosely based on public multi-game / multi-core benchmarks.

export type CPU = {
  id: string;    // e.g. "intel-core-i9-14900k"
  name: string;  // e.g. "Intel Core i9-14900K"
  score: number;
  socket: string;
  tdp: number;   // W (base TDP / PPT ballpark)
};

export const cpus: CPU[] = [
  // --- Intel 14th gen (Raptor Lake Refresh, LGA1700) ---
  { id: "intel-core-i9-14900ks", name: "Intel Core i9-14900KS", score: 36000, socket: "LGA1700", tdp: 150 },
  { id: "intel-core-i9-14900k",  name: "Intel Core i9-14900K",  score: 34000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i7-14700k",  name: "Intel Core i7-14700K",  score: 30000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i5-14600k",  name: "Intel Core i5-14600K",  score: 26000, socket: "LGA1700", tdp: 125 },

  // --- Intel 13th gen (Raptor Lake, LGA1700) ---
  { id: "intel-core-i9-13900ks", name: "Intel Core i9-13900KS", score: 33000, socket: "LGA1700", tdp: 150 },
  { id: "intel-core-i9-13900k",  name: "Intel Core i9-13900K",  score: 31500, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i7-13700k",  name: "Intel Core i7-13700K",  score: 28000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i5-13600k",  name: "Intel Core i5-13600K",  score: 24000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i5-13400f",  name: "Intel Core i5-13400F",  score: 19000, socket: "LGA1700", tdp: 65  },

  // --- Intel 12th gen (Alder Lake, LGA1700) ---
  { id: "intel-core-i9-12900k",  name: "Intel Core i9-12900K",  score: 27000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i7-12700k",  name: "Intel Core i7-12700K",  score: 24000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i5-12600k",  name: "Intel Core i5-12600K",  score: 21000, socket: "LGA1700", tdp: 125 },
  { id: "intel-core-i5-12400f",  name: "Intel Core i5-12400F",  score: 17000, socket: "LGA1700", tdp: 65  },

  // --- Intel older gaming staples (LGA1200 / 1151) ---
  { id: "intel-core-i9-11900k",  name: "Intel Core i9-11900K",  score: 20000, socket: "LGA1200", tdp: 125 },
  { id: "intel-core-i7-11700k",  name: "Intel Core i7-11700K",  score: 18500, socket: "LGA1200", tdp: 125 },
  { id: "intel-core-i5-11600k",  name: "Intel Core i5-11600K",  score: 16000, socket: "LGA1200", tdp: 125 },
  { id: "intel-core-i9-10900k",  name: "Intel Core i9-10900K",  score: 19000, socket: "LGA1200", tdp: 125 },
  { id: "intel-core-i7-10700k",  name: "Intel Core i7-10700K",  score: 17000, socket: "LGA1200", tdp: 125 },
  { id: "intel-core-i5-10600k",  name: "Intel Core i5-10600K",  score: 15000, socket: "LGA1200", tdp: 125 },

  // --- AMD Ryzen 7000 / AM5 ---
  { id: "amd-ryzen-9-7950x3d",   name: "AMD Ryzen 9 7950X3D",   score: 35500, socket: "AM5",    tdp: 120 },
  { id: "amd-ryzen-9-7950x",     name: "AMD Ryzen 9 7950X",     score: 33000, socket: "AM5",    tdp: 170 },
  { id: "amd-ryzen-9-7900x3d",   name: "AMD Ryzen 9 7900X3D",   score: 32000, socket: "AM5",    tdp: 120 },
  { id: "amd-ryzen-9-7900x",     name: "AMD Ryzen 9 7900X",     score: 30000, socket: "AM5",    tdp: 170 },
  { id: "amd-ryzen-7-7800x3d",   name: "AMD Ryzen 7 7800X3D",   score: 31000, socket: "AM5",    tdp: 120 },
  { id: "amd-ryzen-7-7700x",     name: "AMD Ryzen 7 7700X",     score: 26000, socket: "AM5",    tdp: 105 },
  { id: "amd-ryzen-5-7600x",     name: "AMD Ryzen 5 7600X",     score: 22000, socket: "AM5",    tdp: 105 },
  { id: "amd-ryzen-5-7600",      name: "AMD Ryzen 5 7600",      score: 20000, socket: "AM5",    tdp: 65  },

  // --- AMD Ryzen 5000 / AM4 ---
  { id: "amd-ryzen-9-5950x",     name: "AMD Ryzen 9 5950X",     score: 26000, socket: "AM4",    tdp: 105 },
  { id: "amd-ryzen-9-5900x",     name: "AMD Ryzen 9 5900X",     score: 24000, socket: "AM4",    tdp: 105 },
  { id: "amd-ryzen-7-5800x3d",   name: "AMD Ryzen 7 5800X3D",   score: 25000, socket: "AM4",    tdp: 105 },
  { id: "amd-ryzen-7-5800x",     name: "AMD Ryzen 7 5800X",     score: 21000, socket: "AM4",    tdp: 105 },
  { id: "amd-ryzen-7-5700x",     name: "AMD Ryzen 7 5700X",     score: 19500, socket: "AM4",    tdp: 65  },
  { id: "amd-ryzen-5-5600x",     name: "AMD Ryzen 5 5600X",     score: 18000, socket: "AM4",    tdp: 65  },
  { id: "amd-ryzen-5-5600",      name: "AMD Ryzen 5 5600",      score: 16500, socket: "AM4",    tdp: 65  },
  { id: "amd-ryzen-5-3600",      name: "AMD Ryzen 5 3600",      score: 13500, socket: "AM4",    tdp: 65  },

  // --- Older Intel “still gaming” chips ---
  { id: "intel-core-i7-9700k",   name: "Intel Core i7-9700K",   score: 14000, socket: "LGA1151", tdp: 95  },
  { id: "intel-core-i5-9600k",   name: "Intel Core i5-9600K",   score: 12000, socket: "LGA1151", tdp: 95  },
  { id: "intel-core-i7-8700k",   name: "Intel Core i7-8700K",   score: 13000, socket: "LGA1151", tdp: 95  },
  { id: "intel-core-i5-8400",    name: "Intel Core i5-8400",    score: 10000, socket: "LGA1151", tdp: 65  },

  // --- A few mobile parts (approximate) ---
  { id: "intel-core-i9-13980hx", name: "Intel Core i9-13980HX", score: 26000, socket: "BGA (mobile)", tdp: 55 },
  { id: "intel-core-i7-13700h",  name: "Intel Core i7-13700H",  score: 20000, socket: "BGA (mobile)", tdp: 45 },
  { id: "amd-ryzen-9-7945hx",    name: "AMD Ryzen 9 7945HX",    score: 27000, socket: "FP8 (mobile)", tdp: 55 },
  { id: "amd-ryzen-7-7840hs",    name: "AMD Ryzen 7 7840HS",    score: 19000, socket: "FP7r2 (mobile)", tdp: 35 },
];
