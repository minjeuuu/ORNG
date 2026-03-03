import React, { useState, useEffect } from 'react';
import { Trophy, DollarSign, Lock, Unlock, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export function FundingChallenge() {
  const [balance, setBalance] = useState(100000);
  const [equity, setEquity] = useState(100000);
  const [highWaterMark, setHighWaterMark] = useState(100000);
  const [phase, setPhase] = useState<'challenge' | 'funded' | 'payout'>('challenge');
  const [daysTraded, setDaysTraded] = useState(0);
  const [trades, setTrades] = useState<{id: number, type: 'LONG' | 'SHORT', profit: number}[]>([]);
  
  // Simulation of live trading
  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === 'payout') return;

      // Random walk simulation
      const change = (Math.random() - 0.45) * 200; // Slight upward drift (55% win rate bias)
      
      setEquity(prev => {
        const next = prev + change;
        if (next > highWaterMark) setHighWaterMark(next);
        return next;
      });
      setDaysTraded(d => d + 1);

      // Add a simulated trade
      if (Math.random() > 0.7) {
        setTrades(prev => [{
          id: Date.now(),
          type: Math.random() > 0.5 ? 'LONG' : 'SHORT',
          profit: change
        }, ...prev].slice(0, 5));
      }

    }, 1000);
    return () => clearInterval(interval);
  }, [highWaterMark, phase]);

  const profit = equity - 100000;
  const drawdown = (highWaterMark - equity) / highWaterMark;
  const profitTarget = 10000; // 10%
  const maxDrawdown = 0.05; // 5%

  const handleWithdraw = () => {
    alert(`INITIATING TRANSFER: $${(profit * 0.8).toFixed(2)} sent to connected wallet.`);
    setBalance(100000);
    setEquity(100000);
    setHighWaterMark(100000);
    setPhase('funded');
  };

  return (
    <div className="card p-6 h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="text-orange-500" size={20} />
            ORNG PROP <span className="text-slate-600 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">SIMULATION</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Capital Allocation Protocol</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Account Equity</div>
          <div className="text-2xl font-mono font-bold text-white">${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-6 mb-8 relative z-10">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Profit Target ($10k)</span>
            <span className={profit >= profitTarget ? "text-emerald-400" : "text-slate-400"}>
              ${profit.toFixed(2)} / $10,000.00
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max((profit / profitTarget) * 100, 0), 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Max Drawdown (5%)</span>
            <span className={drawdown > maxDrawdown ? "text-rose-400" : "text-slate-400"}>
              {(drawdown * 100).toFixed(2)}% / 5.00%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${drawdown > maxDrawdown ? 'bg-rose-500' : 'bg-orange-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((drawdown / maxDrawdown) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Status</div>
          <div className="flex items-center gap-2 mt-1">
            {drawdown > maxDrawdown ? (
              <>
                <Lock size={14} className="text-rose-500" />
                <span className="text-sm font-bold text-rose-500">FAILED</span>
              </>
            ) : profit >= profitTarget ? (
              <>
                <Unlock size={14} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">PASSED</span>
              </>
            ) : (
              <>
                <TrendingUp size={14} className="text-orange-500" />
                <span className="text-sm font-bold text-orange-500">ACTIVE</span>
              </>
            )}
          </div>
        </div>
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Payout Split</div>
          <div className="flex items-center gap-2 mt-1">
            <DollarSign size={14} className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-200">80 / 20</span>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="mb-8 relative z-10">
        <div className="text-[10px] text-slate-500 uppercase mb-2">Recent Activity</div>
        <div className="space-y-2">
          {trades.map(trade => (
            <div key={trade.id} className="flex justify-between items-center text-xs p-2 bg-slate-900/50 rounded border border-slate-800/50">
              <span className={`font-mono font-bold ${trade.type === 'LONG' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trade.type}
              </span>
              <span className={trade.profit > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
              </span>
            </div>
          ))}
          {trades.length === 0 && <div className="text-xs text-slate-600 italic">Waiting for signals...</div>}
        </div>
      </div>

      {/* Withdraw Action */}
      <div className="mt-auto relative z-10">
        <button 
          onClick={handleWithdraw}
          disabled={profit < profitTarget || drawdown > maxDrawdown}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
            profit >= profitTarget 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/20' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Wallet size={18} />
          {profit >= profitTarget ? 'WITHDRAW EARNINGS' : 'LOCKED'}
        </button>
        <p className="text-[10px] text-center text-slate-600 mt-3">
          *Simulated environment. No real capital at risk.
        </p>
      </div>
    </div>
  );
}
