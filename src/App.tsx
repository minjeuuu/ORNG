import React, { useState, useMemo, useEffect } from 'react';
import { useMarketData } from './hooks/useMarketData';
import { runBacktest, calculateStats } from './lib/orng/backtest';
import { TearSheet } from './components/TearSheet';
import { StatsCard } from './components/StatsCard';
import { SignalTable } from './components/SignalTable';
import { FactorAnalysis } from './components/FactorAnalysis';
import { AIAnalyst } from './components/AIAnalyst';
import { Logo } from './components/Logo';
import { LiveTrading } from './components/LiveTrading';
import { SearchMiner } from './components/SearchMiner';
import { BrokerConnect } from './components/BrokerConnect';
import { EarnHub } from './components/EarnHub';
import { WalletComponent } from './components/Wallet';
import { AdminDashboard } from './components/AdminDashboard';
import { ClaudeHelp } from './components/ClaudeHelp';
import { Activity, Settings, RefreshCw, ShieldAlert, PlayCircle, Layers, Terminal, Cpu, Trophy, Briefcase, Database, Key, Link, Wallet, DollarSign, Lock, Zap, Bot } from 'lucide-react';
import { motion } from 'motion/react';

function App() {
  const [symbol, setSymbol] = useState('SPY');
  const [period, setPeriod] = useState('10y');
  const [activeTab, setActiveTab] = useState<'earn' | 'trade' | 'wallet' | 'connect' | 'admin' | 'help'>('earn');
  const { data, loading, error } = useMarketData(symbol, period);
  const [balance, setBalance] = useState(5000);

  // Load real balance from OKX and Blockchain Pool
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/wallet/balance');
        const data = await res.json();
        if (data.success) {
          // Initialize with server balance if available
          if (data.balance > 0) setBalance(data.balance);
        }
      } catch (err) {
        console.error('Failed to fetch balance', err);
      }
    };
    
    fetchBalance();
    // Poll for live blockchain updates
    const interval = setInterval(fetchBalance, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleEarn = (amount: number, source: string) => {
    setBalance(prev => prev + amount);
  };

  const handleWithdraw = (amount: number, method: string, destination: string) => {
    setBalance(prev => prev - amount);
  };

  // Strategy Config State
  const [config, setConfig] = useState({
    fastWindow: 20,
    slowWindow: 100,
    volTarget: 0.15, // 15% vol target
    stopLoss: 0.10
  });

  // Run Backtest Memoized
  const results = useMemo(() => {
    if (!data || data.length === 0) return [];
    return runBacktest(data, config);
  }, [data, config]);

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    return calculateStats(results);
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none">ORNG <span className="font-normal text-emerald-500">REWARDS</span></span>
              <span className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase">Protocol V2.0</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button 
                onClick={() => setActiveTab('earn')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'earn' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <DollarSign size={14} />
                EARN
              </button>
              <button 
                onClick={() => setActiveTab('trade')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'trade' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Activity size={14} />
                TRADE
              </button>
              <button 
                onClick={() => setActiveTab('wallet')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'wallet' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Wallet size={14} />
                WALLET
              </button>
              <button 
                onClick={() => setActiveTab('connect')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'connect' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Link size={14} />
                CONNECT
              </button>
              <button 
                onClick={() => setActiveTab('help')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'help' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Bot size={14} />
                HELP
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-600 hover:text-slate-400'}`}
                title="Admin Dashboard"
              >
                <Lock size={14} />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">USDT Balance</div>
                <motion.div 
                  key={balance}
                  initial={{ scale: 1.2, color: '#10b981' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-sm font-mono font-bold"
                >
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-56px)]">
        {activeTab === 'earn' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <EarnHub onEarn={handleEarn} />
          </motion.div>
        ) : activeTab === 'trade' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <LiveTrading onEarn={handleEarn} />
          </motion.div>
        ) : activeTab === 'wallet' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full max-w-4xl mx-auto"
          >
            <WalletComponent balance={balance} onWithdraw={handleWithdraw} />
          </motion.div>
        ) : activeTab === 'connect' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full max-w-4xl mx-auto"
          >
            <BrokerConnect />
          </motion.div>
        ) : activeTab === 'help' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full max-w-4xl mx-auto"
          >
            <ClaudeHelp />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <AdminDashboard />
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;

