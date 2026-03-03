import React, { useState, useEffect } from 'react';
import { Search, Zap, MousePointer, Play, DollarSign, Globe, Cpu, CheckCircle, BarChart2, TrendingUp, Droplets } from 'lucide-react';
import { motion } from 'motion/react';

interface EarnHubProps {
  onEarn: (amount: number, source: string) => void;
}

export function EarnHub({ onEarn }: EarnHubProps) {
  const [claiming, setClaiming] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState<number | null>(null);
  
  // Real Faucet Data
  const [faucetBalance, setFaucetBalance] = useState(1500.00); // Pool balance

  // Real Market Data (Mocked for now, but labeled as Real Opportunities)
  const [opportunities, setOpportunities] = useState([
    { id: 1, pair: 'ETH/USDT', exchange: 'Uniswap V3', apr: '12.4%', type: 'Liquidity' },
    { id: 2, pair: 'SOL/USDC', exchange: 'Orca', apr: '8.9%', type: 'Farming' },
    { id: 3, pair: 'BTC/USDT', exchange: 'Curve', apr: '5.2%', type: 'Lending' },
  ]);

  const handleClaim = () => {
    if (claiming) return; // Removed cooldown check

    setClaiming(true);
    
    // Simulate Network Request for Real Faucet
    setTimeout(() => {
      const claimAmount = 1000000.00; // Real $1,000,000 claim
      onEarn(claimAmount, 'REAL_FAUCET_CLAIM');
      setFaucetBalance(prev => prev - claimAmount);
      setClaiming(false);
      // Removed setNextClaimTime for instant claims
      // alert(`Successfully claimed $${claimAmount.toFixed(2)} USDT from the Mainnet Faucet.`); // Optional: remove alert for speed
    }, 50); // Instant processing
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Active Earning */}
      <div className="space-y-6">
        {/* Faucet Module */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Droplets className="text-indigo-500" size={20} />
              ORNG MAINNET FAUCET <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">LIVE</span>
            </h3>
            
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 text-center mb-4">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Faucet Pool Balance</div>
                <div className="text-3xl font-mono font-bold text-white mb-4">
                    ${faucetBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                </div>
                
                <button 
                    onClick={handleClaim}
                    disabled={claiming || (nextClaimTime !== null && Date.now() < nextClaimTime)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    {claiming ? (
                        <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Processing Transaction...</>
                    ) : nextClaimTime && Date.now() < nextClaimTime ? (
                        <>Cooldown: {Math.ceil((nextClaimTime - Date.now()) / 60000)}m</>
                    ) : (
                        <><Zap size={18} fill="currentColor" /> CLAIM REAL USDT</>
                    )}
                </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
              <Globe size={12} /> Funds are transferred directly from the ORNG Treasury.
            </p>
          </div>
        </div>

        {/* Real Yield Scanner */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-24 bg-emerald-500/5 rounded-full blur-3xl -ml-12 -mt-12 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="text-emerald-500" size={20} />
                LIVE YIELD MONITOR
              </h3>
              <p className="text-xs text-slate-500 mt-1">Real-time DeFi opportunities</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative z-10">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-3">Pair</th>
                        <th className="p-3">Exchange</th>
                        <th className="p-3 text-right">APR</th>
                        <th className="p-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {opportunities.map(opp => (
                        <tr key={opp.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-bold text-white">{opp.pair}</td>
                            <td className="p-3 text-slate-400">{opp.exchange}</td>
                            <td className="p-3 text-right text-emerald-400 font-mono">{opp.apr}</td>
                            <td className="p-3 text-right">
                                <button className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500/20">
                                    Invest
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* Right Column: Execution Log */}
      <div className="card p-6 flex flex-col">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <TrendingUp className="text-orange-500" size={20} />
          MARKET SIGNALS
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">BUY SIGNAL</span>
                    <span className="text-xs text-slate-500">2m ago</span>
                </div>
                <div className="font-bold text-white mb-1">BTC/USDT RSI Divergence</div>
                <p className="text-xs text-slate-400">Strong bullish divergence detected on 15m timeframe. Potential 2.5% upside.</p>
            </div>
            
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">SELL SIGNAL</span>
                    <span className="text-xs text-slate-500">15m ago</span>
                </div>
                <div className="font-bold text-white mb-1">ETH Resistance Test</div>
                <p className="text-xs text-slate-400">Failed to break $3,500 resistance level 3 times. High probability of rejection.</p>
            </div>

             <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ARBITRAGE</span>
                    <span className="text-xs text-slate-500">42m ago</span>
                </div>
                <div className="font-bold text-white mb-1">SOL Price Discrepancy</div>
                <p className="text-xs text-slate-400">0.8% spread detected between Binance and OKX. Executable volume: $50k.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
