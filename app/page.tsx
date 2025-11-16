// app/page.tsx
"use client";

import { useState, useMemo } from "react";
import { cpus } from "../data/cpus";
import { gpus } from "../data/gpus";
import { games } from "../data/games";
import type { FpsTable } from "./api/predict/route";

type RamGen = "DDR3" | "DDR4" | "DDR5";

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
  gain1080: number;
  gain1440: number;
  gain4k: number;
};

const ramAmountOptions = [8, 16, 32, 64, 128];

const ramSpeedOptionsByGen: Record<RamGen, number[]> = {
  DDR3: [1333, 1600, 1866, 2133],
  DDR4: [2133, 2400, 2666, 3000, 3200, 3600, 4000],
  DDR5: [4800, 5200, 5600, 6000, 6400],
};

export default function HomePage() {
  const [cpuId, setCpuId] = useState<string>(cpus[0]?.id);
  const [gpuId, setGpuId] = useState<string>(gpus[0]?.id);
  const [gameId, setGameId] = useState<string>(games[0]?.id);

  const [ramGb, setRamGb] = useState<number>(16);
  const [ramGen, setRamGen] = useState<RamGen>("DDR4");
  const [ramSpeed, setRamSpeed] = useState<number>(
    ramSpeedOptionsByGen["DDR4"][2] ?? 3200
  );

  const [fpsTable, setFpsTable] = useState<FpsTable | null>(null);
  const [bottleneck, setBottleneck] = useState<BottleneckInfo | null>(null);
  const [upgrades, setUpgrades] = useState<UpgradeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ramSpeedOptions = useMemo(
    () => ramSpeedOptionsByGen[ramGen],
    [ramGen]
  );

  // If current speed not valid for new gen, snap to first option
  if (!ramSpeedOptions.includes(ramSpeed)) {
    setRamSpeed(ramSpeedOptions[0]);
  }

  async function handlePredict() {
    if (!cpuId || !gpuId || !gameId) return;

    setLoading(true);
    setError(null);
    setFpsTable(null);
    setBottleneck(null);
    setUpgrades([]);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpuId,
          gpuId,
          gameId,
          ramGb,
          ramGen,
          ramSpeed,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await res.json();
      setFpsTable(data.fpsTable);
      setBottleneck(data.bottleneck);
      setUpgrades(data.upgrades);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">PC Performance Planner</h1>
          <p className="text-slate-400 text-sm">
            Real-world game performance estimates based on your CPU, GPU, and
            memory config. FPS across 1080p / 1440p / 4K, plus bottlenecks and
            upgrade suggestions.
          </p>
        </header>

        {/* Config form */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* CPU */}
            <div className="space-y-1">
              <label className="text-sm font-medium">CPU</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={cpuId}
                onChange={(e) => setCpuId(e.target.value)}
              >
                {cpus.map((cpu) => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPU */}
            <div className="space-y-1">
              <label className="text-sm font-medium">GPU</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={gpuId}
                onChange={(e) => setGpuId(e.target.value)}
              >
                {gpus.map((gpu) => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RAM amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium">RAM Amount (GB)</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={ramGb}
                onChange={(e) => setRamGb(Number(e.target.value))}
              >
                {ramAmountOptions.map((v) => (
                  <option key={v} value={v}>
                    {v} GB
                  </option>
                ))}
              </select>
            </div>

            {/* RAM generation */}
            <div className="space-y-1">
              <label className="text-sm font-medium">RAM Generation</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={ramGen}
                onChange={(e) => setRamGen(e.target.value as RamGen)}
              >
                <option value="DDR3">DDR3</option>
                <option value="DDR4">DDR4</option>
                <option value="DDR5">DDR5</option>
              </select>
            </div>

            {/* RAM speed */}
            <div className="space-y-1">
              <label className="text-sm font-medium">RAM Speed (MHz)</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={ramSpeed}
                onChange={(e) => setRamSpeed(Number(e.target.value))}
              >
                {ramSpeedOptions.map((v) => (
                  <option key={v} value={v}>
                    {v} MHz
                  </option>
                ))}
              </select>
            </div>

            {/* Game */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Game</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-sm"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              >
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-4 py-2 text-sm font-semibold"
          >
            {loading ? "Estimating..." : "Estimate Performance"}
          </button>

          {error && (
            <p className="text-sm text-red-400 mt-2">
              {error}
            </p>
          )}
        </section>

        {/* Results */}
        {fpsTable && (
          <section className="space-y-4">
            {/* FPS tables */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <h2 className="text-lg font-semibold">
                Expected FPS – {games.find((g) => g.id === gameId)?.name}
              </h2>
              <p className="text-xs text-slate-400 mb-2">
                Average FPS and 1% lows for each resolution and quality preset.
              </p>

              {(["1080p", "1440p", "4k"] as Array<keyof FpsTable>).map(
                (resKey) => (
                  <div key={resKey} className="space-y-1">
                    <h3 className="text-sm font-semibold">
                      {resKey.toUpperCase()}
                    </h3>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          <th className="text-left py-1">Preset</th>
                          <th className="text-right">Avg FPS</th>
                          <th className="text-right">1% Low</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(["low", "medium", "high", "ultra"] as const).map(
                          (q) => {
                            const row = fpsTable[resKey][q];
                            return (
                              <tr key={q} className="border-b border-slate-800">
                                <td className="py-1 capitalize">{q}</td>
                                <td className="text-right font-mono">
                                  {row.avg}
                                </td>
                                <td className="text-right font-mono">
                                  {row.low1}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>

            {/* Bottleneck */}
            {bottleneck && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-2">Bottleneck</h2>
                <p className="text-sm mb-2">
                  Primary bottleneck:{" "}
                  <span className="font-semibold text-amber-400">
                    {bottleneck.primary}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">CPU potential</p>
                    <p className="font-mono">
                      {(bottleneck.cpuScoreNorm * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">GPU potential</p>
                    <p className="font-mono">
                      {(bottleneck.gpuScoreNorm * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">RAM potential</p>
                    <p className="font-mono">
                      {(bottleneck.ramScoreNorm * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrades */}
            {upgrades.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <h2 className="text-lg font-semibold">Recommended Upgrades</h2>
                <p className="text-xs text-slate-400 mb-1">
                  FPS gain is shown at Ultra settings for each resolution.
                </p>
                <div className="space-y-3">
                  {upgrades.map((u, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-lg p-3 text-sm"
                    >
                      <p className="font-semibold mb-1">
                        {idx + 1}. {u.type} upgrade:{" "}
                        <span className="text-emerald-400">
                          {u.from} → {u.to}
                        </span>
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-slate-400">1080p Ultra</p>
                          <p className="font-mono">
                            {u.gain1080 >= 0 ? "+" : ""}
                            {u.gain1080} FPS
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">1440p Ultra</p>
                          <p className="font-mono">
                            {u.gain1440 >= 0 ? "+" : ""}
                            {u.gain1440} FPS
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">4K Ultra</p>
                          <p className="font-mono">
                            {u.gain4k >= 0 ? "+" : ""}
                            {u.gain4k} FPS
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
