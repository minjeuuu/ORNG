import React from 'react';
import { BacktestResult } from '../types';

export function SignalTable({ results }: { results: BacktestResult[] }) {
  // Show last 20 signals/days
  const recentData = [...results].reverse().slice(0, 20);

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200">Recent Signals</h3>
        <span className="text-xs text-slate-500 font-mono">LIVE LOG</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium text-center">Signal</th>
              <th className="px-4 py-3 font-medium text-right">Return</th>
              <th className="px-4 py-3 font-medium text-right">Vol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-xs">
            {recentData.map((row) => (
              <tr key={row.date} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-2 text-slate-400">{row.date}</td>
                <td className="px-4 py-2 text-slate-300">${row.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.signal === 1 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    row.signal === -1 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    'bg-slate-700/30 text-slate-500'
                  }`}>
                    {row.signal === 1 ? 'LONG' : row.signal === -1 ? 'SHORT' : 'FLAT'}
                  </span>
                </td>
                <td className={`px-4 py-2 text-right ${
                  row.strategyReturn > 0 ? 'text-emerald-400' : row.strategyReturn < 0 ? 'text-rose-400' : 'text-slate-500'
                }`}>
                  {(row.strategyReturn * 100).toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-right text-slate-500">
                  {row.factors?.volatility ? (row.factors.volatility * 100).toFixed(1) + '%' : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
