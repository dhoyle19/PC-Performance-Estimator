// app/api/predict/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cpus } from "../../../data/cpus";
import { gpus } from "../../../data/gpus";
import { games } from "../../../data/games";
import {
  gameBaselines,
  ResolutionKey,
  QualityKey,
  FpsPoint,
} from "../../../data/benchmarks";

type RamGen = "DDR3" | "DDR4" | "DDR5";

type RequestBody = {
  cpuId: string;
  gpuId: string;
  gameId: string;
  ramGb: number;
  ramGen: RamGen;
  ramSpeed: number; // MHz
};

export type FpsTable = {
  [resolution in ResolutionKey]: {
    [quality in QualityKey]: FpsPoint;
  };
};

type BottleneckInfo = {
  primary: "CPU" | "GPU" | "RAM";
  cpuScoreNorm: number;
  gpuScoreNorm: number;
  ramScoreNorm: number;
};

type UpgradeSuggestion = {
  type: "CPU" | "GPU" | "RAM";
  from: string;
  to: string;
  gain1080: number; // FPS gained @1080p Ultra
  gain1440: number; // FPS gained @1440p Ultra
  gain4k: number;   // FPS gained @4K Ultra
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round(v: number): number {
  return Math.round(v);
}

function calcRamScale(ramGb: number, ramGen: RamGen, ramSpeed: number): number {
  const baselineSpeed =
    ramGen === "DDR3" ? 1600 :
    ramGen === "DDR4" ? 3200 :
    5600; // DDR5

  const speedFactor = clamp(ramSpeed / baselineSpeed, 0.6, 1.4);
  const capFactor = clamp(ramGb / 16, 0.7, 1.3); // 16GB as "1.0"
  return clamp(speedFactor * capFactor, 0.6, 1.6);
}

function getBaseline(gameId: string) {
  const baseline = gameBaselines.find((b) => b.gameId === gameId);
  if (!baseline) throw new Error(`No baseline data for game '${gameId}'`);
  return baseline;
}

function scaleFpsTable(
  baselineTable: FpsTable,
  cpuScore: number,
  gpuScore: number,
  ramGb: number,
  ramGen: RamGen,
  ramSpeed: number,
  baselineCpuScore: number,
  baselineGpuScore: number
): FpsTable {
  const gpuScale = clamp(gpuScore / baselineGpuScore, 0.1, 5.0);
  const cpuScale = clamp(cpuScore / baselineCpuScore, 0.3, 2.0);
  const ramScale = calcRamScale(ramGb, ramGen, ramSpeed);

  // Heavier GPU for avg FPS, heavier CPU/RAM for 1% lows
  const gpuWeightAvg = 0.85;
  const cpuWeightAvg = 0.12;
  const ramWeightAvg = 0.03;

  const gpuWeightLow = 0.6;
  const cpuWeightLow = 0.3;
  const ramWeightLow = 0.1;

  const avgScale =
    gpuScale ** gpuWeightAvg *
    cpuScale ** cpuWeightAvg *
    ramScale ** ramWeightAvg;

  const lowScale =
    gpuScale ** gpuWeightLow *
    cpuScale ** cpuWeightLow *
    ramScale ** ramWeightLow;

  const out: FpsTable = {
    "1080p": { low: { avg: 0, low1: 0 }, medium: { avg: 0, low1: 0 }, high: { avg: 0, low1: 0 }, ultra: { avg: 0, low1: 0 } },
    "1440p": { low: { avg: 0, low1: 0 }, medium: { avg: 0, low1: 0 }, high: { avg: 0, low1: 0 }, ultra: { avg: 0, low1: 0 } },
    "4k":    { low: { avg: 0, low1: 0 }, medium: { avg: 0, low1: 0 }, high: { avg: 0, low1: 0 }, ultra: { avg: 0, low1: 0 } },
  };

  (["1080p", "1440p", "4k"] as ResolutionKey[]).forEach((res) => {
    (["low", "medium", "high", "ultra"] as QualityKey[]).forEach((q) => {
      const base = baselineTable[res][q];
      out[res][q] = {
        avg: round(base.avg * avgScale),
        low1: round(base.low1 * lowScale),
      };
    });
  });

  return out;
}

function detectBottleneck(
  cpuId: string,
  gpuId: string,
  ramGb: number,
  ramGen: RamGen,
  ramSpeed: number
): BottleneckInfo {
  const cpu = cpus.find((c) => c.id === cpuId)!;
  const gpu = gpus.find((g) => g.id === gpuId)!;

  const maxCpu = Math.max(...cpus.map((c) => c.score));
  const maxGpu = Math.max(...gpus.map((g) => g.score));

  const cpuNorm = clamp(cpu.score / maxCpu, 0, 1);
  const gpuNorm = clamp(gpu.score / maxGpu, 0, 1);

  const ramScale = calcRamScale(ramGb, ramGen, ramSpeed);
  const ramNorm = clamp((ramScale - 0.6) / (1.6 - 0.6), 0, 1); // normalize back into 0–1

  const scores = [
    { type: "CPU" as const, value: cpuNorm },
    { type: "GPU" as const, value: gpuNorm },
    { type: "RAM" as const, value: ramNorm },
  ].sort((a, b) => a.value - b.value);

  return {
    primary: scores[0].type,
    cpuScoreNorm: Number(cpuNorm.toFixed(2)),
    gpuScoreNorm: Number(gpuNorm.toFixed(2)),
    ramScoreNorm: Number(ramNorm.toFixed(2)),
  };
}

function suggestUpgrades(
  cpuId: string,
  gpuId: string,
  gameId: string,
  ramGb: number,
  ramGen: RamGen,
  ramSpeed: number,
  currentTable: FpsTable
): UpgradeSuggestion[] {
  const cpu = cpus.find((c) => c.id === cpuId)!;
  const gpu = gpus.find((g) => g.id === gpuId)!;
  const baseline = getBaseline(gameId);

  const baseTable = currentTable;

  const out: UpgradeSuggestion[] = [];

  const baselineGpu = gpus.find((g) => g.id === baseline.baselineGpuId);
  if (!baselineGpu) {
    return out;
  }

  // GPU upgrades
  gpus
    .filter((g) => g.score > gpu.score)
    .forEach((newGpu) => {
      const tableNew = scaleFpsTable(
        baseline.table,
        cpu.score,
        newGpu.score,
        ramGb,
        ramGen,
        ramSpeed,
        baseline.baselineCpuScore,
        baselineGpu.score
      );

      const gain1080 =
        tableNew["1080p"].ultra.avg - baseTable["1080p"].ultra.avg;
      const gain1440 =
        tableNew["1440p"].ultra.avg - baseTable["1440p"].ultra.avg;
      const gain4k = tableNew["4k"].ultra.avg - baseTable["4k"].ultra.avg;

      out.push({
        type: "GPU",
        from: gpu.name,
        to: newGpu.name,
        gain1080,
        gain1440,
        gain4k,
      });
    });

  // CPU upgrades (same socket)
  cpus
    .filter((c) => c.socket === cpu.socket && c.score > cpu.score)
    .forEach((newCpu) => {
      const tableNew = scaleFpsTable(
        baseline.table,
        newCpu.score,
        gpu.score,
        ramGb,
        ramGen,
        ramSpeed,
        baseline.baselineCpuScore,
        baselineGpu.score
      );

      const gain1080 =
        tableNew["1080p"].ultra.avg - baseTable["1080p"].ultra.avg;
      const gain1440 =
        tableNew["1440p"].ultra.avg - baseTable["1440p"].ultra.avg;
      const gain4k = tableNew["4k"].ultra.avg - baseTable["4k"].ultra.avg;

      out.push({
        type: "CPU",
        from: cpu.name,
        to: newCpu.name,
        gain1080,
        gain1440,
        gain4k,
      });
    });

  // RAM upgrade suggestion: push to 32GB DDR4/DDR5 or higher speed
  if (ramGb < 32 || (ramGen === "DDR3" && ramGb < 16)) {
    const targetGb = ramGb < 16 ? 16 : 32;
    const targetGen = ramGen === "DDR3" ? "DDR4" : ramGen;
    const targetSpeed =
      targetGen === "DDR3" ? 1866 :
      targetGen === "DDR4" ? 3200 :
      5600;

    const tableNew = scaleFpsTable(
      baseline.table,
      cpu.score,
      gpu.score,
      targetGb,
      targetGen,
      targetSpeed,
      baseline.baselineCpuScore,
      baselineGpu.score
    );

    const gain1080 =
      tableNew["1080p"].ultra.avg - baseTable["1080p"].ultra.avg;
    const gain1440 =
      tableNew["1440p"].ultra.avg - baseTable["1440p"].ultra.avg;
    const gain4k = tableNew["4k"].ultra.avg - baseTable["4k"].ultra.avg;

    out.push({
      type: "RAM",
      from: `${ramGb}GB ${ramGen} @ ${ramSpeed}MHz`,
      to: `${targetGb}GB ${targetGen} @ ${targetSpeed}MHz`,
      gain1080,
      gain1440,
      gain4k,
    });
  }

  return out
    .map((u) => ({
      ...u,
      gain1080: round(u.gain1080),
      gain1440: round(u.gain1440),
      gain4k: round(u.gain4k),
    }))
    .sort((a, b) => {
      const avgA = (a.gain1080 + a.gain1440 + a.gain4k) / 3;
      const avgB = (b.gain1080 + b.gain1440 + b.gain4k) / 3;
      return avgB - avgA;
    })
    .slice(0, 5);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { cpuId, gpuId, gameId, ramGb, ramGen, ramSpeed } = body;

    const cpu = cpus.find((c) => c.id === cpuId);
    const gpu = gpus.find((g) => g.id === gpuId);
    const game = games.find((g) => g.id === gameId);
    if (!cpu || !gpu || !game) {
      return NextResponse.json(
        { error: "Invalid CPU, GPU, or game selection" },
        { status: 400 }
      );
    }

    const baseline = getBaseline(gameId);
    const baselineGpu = gpus.find((g) => g.id === baseline.baselineGpuId);
    if (!baselineGpu) {
      return NextResponse.json(
        { error: "Baseline GPU not found for this game" },
        { status: 500 }
      );
    }

    const fpsTable = scaleFpsTable(
      baseline.table,
      cpu.score,
      gpu.score,
      ramGb,
      ramGen,
      ramSpeed,
      baseline.baselineCpuScore,
      baselineGpu.score
    );

    const bottleneck = detectBottleneck(cpuId, gpuId, ramGb, ramGen, ramSpeed);
    const upgrades = suggestUpgrades(
      cpuId,
      gpuId,
      gameId,
      ramGb,
      ramGen,
      ramSpeed,
      fpsTable
    );

    return NextResponse.json({
      fpsTable,
      bottleneck,
      upgrades,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to compute prediction" },
      { status: 500 }
    );
  }
}
