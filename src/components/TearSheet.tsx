import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, BarChart, Bar, Legend, ReferenceLine } from 'recharts';
import { BacktestResult } from '../types';

interface TearSheetProps {
  results: BacktestResult[];
}

export function TearSheet({ results }: TearSheetProps) {
  const [view, setView] = useState<'equity' | 'drawdown' | 'underwater'>('equity');

  if (!results || results.length === 0) return null;

  // Downsample for performance
  const chartData = results.filter((_, i) => i % 2 === 0);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setView('equity')}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${view === 'equity' ? 'bg-slate-800 text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Equity Curve
          </button>
          <button 
            onClick={() => setView('drawdown')}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${view === 'drawdown' ? 'bg-slate-800 text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Drawdown
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Strategy
          <span className="w-2 h-2 rounded-full bg-slate-700 ml-2"></span> Benchmark (Hold)
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'equity' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 11, fill: '#64748b'}} 
                tickFormatter={(val) => val.slice(0, 4)} 
                minTickGap={50}
                stroke="#334155"
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{fontSize: 11, fill: '#64748b'}}
                tickFormatter={(val) => val.toFixed(2)}
                stroke="#334155"
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#e2e8f0'}}
                itemStyle={{fontSize: '12px'}}
                labelStyle={{color: '#94a3b8', marginBottom: '4px'}}
                formatter={(val: number) => [val.toFixed(3), "Equity"]}
              />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="#f97316" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEquity)" 
                activeDot={{r: 6, fill: '#f97316', stroke: '#fff'}}
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 11, fill: '#64748b'}} 
                tickFormatter={(val) => val.slice(0, 4)} 
                minTickGap={50}
                stroke="#334155"
              />
              <YAxis 
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} 
                tick={{fontSize: 11, fill: '#64748b'}} 
                stroke="#334155"
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#e2e8f0'}}
                itemStyle={{fontSize: '12px'}}
                labelStyle={{color: '#94a3b8', marginBottom: '4px'}}
                formatter={(val: number) => [`${(val * 100).toFixed(2)}%`, "Drawdown"]} 
              />
              <Area 
                type="monotone" 
                dataKey="drawdown" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.2} 
                strokeWidth={2}
              />
              <ReferenceLine y={0} stroke="#334155" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
