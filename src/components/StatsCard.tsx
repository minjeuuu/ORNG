import React from 'react';
import { StrategyStats } from '../types';

export function StatsCard({ stats }: { stats: StrategyStats }) {
  const formatVal = (val: number, suffix = "") => {
    if (isNaN(val)) return "-";
    return val.toFixed(2) + suffix;
  };

  const formatPct = (val: number) => {
    if (isNaN(val)) return "-";
    return (val * 100).toFixed(1) + "%";
  };

  const metrics = [
    { label: "Sharpe Ratio", value: formatVal(stats.sharpe), highlight: stats.sharpe > 1, desc: "Risk-adjusted return" },
    { label: "Total Return", value: formatPct(stats.totalReturn), highlight: stats.totalReturn > 0, desc: "Cumulative growth" },
    { label: "Ann. Return", value: formatPct(stats.annualizedReturn), desc: "CAGR" },
    { label: "Ann. Volatility", value: formatPct(stats.annualizedVol), desc: "Risk (Std Dev)" },
    { label: "Max Drawdown", value: formatPct(stats.maxDrawdown), danger: true, desc: "Worst peak-to-trough" },
    { label: "Win Rate", value: formatPct(stats.winRate), desc: "% Profitable days" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="card p-4 hover:border-slate-700 transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{m.label}</div>
          </div>
          <div className={`text-2xl font-mono font-bold tracking-tight ${
            m.highlight ? 'text-emerald-400' : m.danger ? 'text-rose-400' : 'text-slate-200'
          }`}>
            {m.value}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {m.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
