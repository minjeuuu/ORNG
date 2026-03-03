import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BacktestResult } from '../types';

export function FactorAnalysis({ results }: { results: BacktestResult[] }) {
  if (!results || results.length === 0) return null;

  // Downsample for performance
  const data = results.filter((_, i) => i % 5 === 0);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-200">Factor Regime Analysis</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Momentum
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Volatility
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Trend
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="date" 
              hide 
            />
            <YAxis 
              yAxisId="left"
              domain={['auto', 'auto']} 
              tick={{fontSize: 10, fill: '#64748b'}}
              stroke="#1e293b"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']} 
              tick={{fontSize: 10, fill: '#64748b'}}
              stroke="#1e293b"
            />
            <Tooltip 
              contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#e2e8f0'}}
              itemStyle={{fontSize: '12px'}}
              labelStyle={{color: '#94a3b8', marginBottom: '4px'}}
            />
            <Line yAxisId="left" type="monotone" dataKey="factors.momentum" stroke="#3b82f6" dot={false} strokeWidth={1.5} name="Momentum" />
            <Line yAxisId="right" type="monotone" dataKey="factors.volatility" stroke="#a855f7" dot={false} strokeWidth={1.5} name="Volatility" />
            <Line yAxisId="left" type="monotone" dataKey="factors.trend" stroke="#10b981" dot={false} strokeWidth={1.5} name="Trend Strength" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
