// scripts/gen_parts_db.js
// Run with:  node scripts/gen_parts_db.js

import fs from "fs";
import path from "path";


const GPU_URL = "https://tpucdn.com/gpu-specs/api/gpu-specs.json";
const CPU_URL = "https://tpucdn.com/cpu-specs/api/cpu-specs.json";

const OUTPUT_GPU = path.resolve("data/gpus.ts");
const OUTPUT_CPU = path.resolve("data/cpus.ts");

function normalizeId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

function generateGpuTs(gpus) {
  return `// AUTO-GENERATED FROM TechPowerUp — DO NOT EDIT
// Contains Top ${gpus.length} GPUs by performance score

export type GPU = {
  id: string;
  name: string;
  score: number;
  vram: number;
  tdp: number;
};

export const gpus: GPU[] = [
${gpus
  .map(
    (g) => `  {
    id: "${g.id}",
    name: "${g.name}",
    score: ${g.score},
    vram: ${g.vram ?? 0},
    tdp: ${g.tdp ?? 0},
  }`
  )
  .join(",\n")}
];
`;
}

function generateCpuTs(cpus) {
  return `// AUTO-GENERATED FROM TechPowerUp — DO NOT EDIT
// Contains Top ${cpus.length} CPUs by performance score

export type CPU = {
  id: string;
  name: string;
  score: number;
  socket: string;
  tdp: number;
};

export const cpus: CPU[] = [
${cpus
  .map(
    (c) => `  {
    id: "${c.id}",
    name: "${c.name}",
    score: ${c.score},
    socket: "${c.socket ?? "Unknown"}",
    tdp: ${c.tdp ?? 0},
  }`
  )
  .join(",\n")}
];
`;
}

async function run() {
  console.log("Fetching GPU database...");
  const gpuData = await fetchJSON(GPU_URL);

  console.log("Fetching CPU database...");
  const cpuData = await fetchJSON(CPU_URL);

  console.log("Processing GPUs...");
  const gpuList = Object.values(gpuData)
    .filter((g) => g["performance"]?.performance)
    .map((g) => ({
      id: normalizeId(g.name),
      name: g.name,
      score: Number(g["performance"].performance),
      vram: g.memory_size ?? 0,
      tdp: g.tdp ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  console.log("Processing CPUs...");
  const cpuList = Object.values(cpuData)
    .filter((c) => c["performance"]?.performance)
    .map((c) => ({
      id: normalizeId(c.name),
      name: c.name,
      score: Number(c["performance"].performance),
      socket: c.socket ?? "Unknown",
      tdp: c.tdp ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  console.log("Saving gpus.ts...");
  fs.writeFileSync(OUTPUT_GPU, generateGpuTs(gpuList));

  console.log("Saving cpus.ts...");
  fs.writeFileSync(OUTPUT_CPU, generateCpuTs(cpuList));

  console.log("Done! Generated:");
  console.log("  → data/gpus.ts");
  console.log("  → data/cpus.ts");
}

run().catch((err) => {
  console.error("Error:", err);
});
