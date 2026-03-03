import React, { useState, useEffect } from 'react';
import { Search, Database, Cpu, Zap, DollarSign, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchMinerProps {
  onAddCapital: (amount: number) => void;
}

export function SearchMiner({ onAddCapital }: SearchMinerProps) {
  const [query, setQuery] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [earnings, setEarnings] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsMining(true);
    setLogs([]);
    
    // Simulation sequence
    const sequence = [
      `Initializing search protocol for "${query}"...`,
      'Scraping global indices...',
      'Quantifying alpha signals...',
      'Monetizing data stream...',
      'Minting synthetic capital...',
      'Transfer complete.'
    ];

    sequence.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === sequence.length - 1) {
          const reward = 1000 + Math.random() * 500;
          setEarnings(prev => prev + reward);
          onAddCapital(reward);
          setIsMining(false);
          setQuery('');
        }
      }, index * 600);
    });
  };

  return (
    <div className="card p-6 h-full flex flex-col relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="text-emerald-500" size={20} />
          ALPHA MINER <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">VIRTUAL</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Convert research queries into synthetic trading capital.
        </p>
      </div>

      {/* Search Interface */}
      <form onSubmit={handleSearch} className="relative z-10 mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter research query (e.g., 'AAPL volatility')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-mono"
            disabled={isMining}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <button 
            type="submit"
            disabled={isMining || !query}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMining ? <RefreshCwSpin /> : <Zap size={18} fill="currentColor" />}
          </button>
        </div>
      </form>

      {/* Console Output */}
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto mb-6 relative z-10 shadow-inner">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-2 text-emerald-500/80 flex items-center gap-2"
            >
              <span className="text-slate-700">{new Date().toLocaleTimeString()}</span>
              <span>{'>'} {log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="text-slate-700 italic text-center mt-10">
            System ready. Awaiting input...
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Session Earnings</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 flex items-center gap-1">
            <DollarSign size={20} />
            {earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Mining Rate</div>
            <div className="text-emerald-500 font-bold flex items-center gap-1 justify-center">
              <Cpu size={14} />
              <span>HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefreshCwSpin() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
