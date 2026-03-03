import React, { useState, useEffect } from 'react';
import { SignalTable } from './SignalTable';
import { StatsCard } from './StatsCard';
import { AIAnalyst } from './AIAnalyst';
import { BlockchainFeed } from './BlockchainFeed';
import { Activity, TrendingUp, Zap, Globe, Cpu, Briefcase, Play, Pause, AlertTriangle, Wifi } from 'lucide-react';
import { useBinanceTicker } from '../hooks/useBinanceTicker';

interface LiveTradingProps {
  onEarn: (amount: number, source: string) => void;
}

export function LiveTrading({ onEarn }: LiveTradingProps) {
  const [botActive, setBotActive] = useState(true); // Auto-start for user
  const tickers = useBinanceTicker(['btcusdt', 'ethusdt', 'solusdt', 'xrpusdt']);
  
  // Use real BTC price or fallback to default
  const btcPrice = tickers['BTCUSDT']?.price || 64230.50;
  const btcChange = tickers['BTCUSDT']?.change24h || 2.5;
  const ethPrice = tickers['ETHUSDT']?.price || 3450.20;
  const ethChange = tickers['ETHUSDT']?.change24h || 1.8;

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Top Stats Row - Powered by Live Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <StatsCard 
          title="BTC/USDT (LIVE)" 
          value={`$${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change={`${btcChange > 0 ? '+' : ''}${btcChange.toFixed(2)}%`} 
          icon={<Globe className="text-orange-400" />} 
          trend={btcChange >= 0 ? "up" : "down"}
        />
        <StatsCard 
          title="ETH/USDT (LIVE)" 
          value={`$${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          change={`${ethChange > 0 ? '+' : ''}${ethChange.toFixed(2)}%`} 
          icon={<Activity className="text-blue-400" />} 
          trend={ethChange >= 0 ? "up" : "down"}
        />
        <StatsCard 
          title="ACTIVE BOTS" 
          value="1,248" 
          change="+84" 
          icon={<Cpu className="text-purple-400" />} 
          trend="up"
        />
        <StatsCard 
          title="NET APY" 
          value="4,291%" 
          change="+120%" 
          icon={<Zap className="text-amber-400" />} 
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left Column: Signals & Bot Control */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          
          {/* Bot Control Panel */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${botActive ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    <Activity size={24} />
                </div>
                <div>
                    <div className="font-bold text-white flex items-center gap-2">
                        ORNG AI TRADER <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 rounded font-bold">LIVE</span>
                    </div>
                    <div className="text-xs text-slate-400">Strategy: High-Frequency Liquidity Injection</div>
                </div>
            </div>
            <button
                onClick={() => setBotActive(!botActive)}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                    botActive 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                }`}
            >
                {botActive ? <><Pause size={18} /> PAUSE INJECTION</> : <><Play size={18} /> START INJECTION</>}
            </button>
          </div>

          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-0">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
               <h3 className="font-bold text-slate-200 flex items-center gap-2">
                 <Activity size={16} className="text-orange-500" />
                 LIVE MARKET SIGNALS
               </h3>
               <div className="flex items-center gap-2">
                 <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                   <Wifi size={10} className="animate-pulse" />
                   BINANCE FEED
                 </span>
                 <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                   SYSTEM ACTIVE
                 </span>
               </div>
             </div>
             <div className="flex-1 overflow-hidden relative">
               <SignalTable />
             </div>
          </div>
          
          {/* AI Analyst Section */}
          <div className="h-1/3 min-h-[200px] shrink-0">
            <AIAnalyst />
          </div>
        </div>

        {/* Right Column: Blockchain Feed */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          <BlockchainFeed />
          
          {/* Warning Card */}
          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl shrink-0">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-400 uppercase">High Volume Alert</h4>
                <p className="text-[10px] text-rose-200/60 leading-relaxed">
                  Massive liquidity injection detected. Ensure your hardware wallet is secure. 
                  Real-time blockchain confirmation may lag by 1-2 blocks due to network congestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
