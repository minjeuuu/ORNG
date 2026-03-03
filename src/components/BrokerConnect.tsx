import React, { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle, ShieldCheck, Key, RefreshCw, Wallet, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Balance {
  total: { [key: string]: number };
  free: { [key: string]: number };
  used: { [key: string]: number };
}

export function BrokerConnect() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/okx/balance');
      const data = await res.json();
      
      if (data.success) {
        setConnected(true);
        setBalance(data.balance);
        if (data.simulated) setIsSimulated(true);
      } else {
        setError(data.error || 'Failed to connect to OKX');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="card p-8 h-full flex flex-col items-center justify-center text-center">
        <RefreshCw className="animate-spin text-emerald-500 mb-4" size={32} />
        <p className="text-slate-400">Connecting to OKX...</p>
      </div>
    );
  }

  if (connected && balance) {
    return (
      <div className="card p-6 h-full flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-slate-950 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">OKX Connected</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-emerald-400 font-mono">
                    {isSimulated ? 'SIMULATION MODE' : 'LIVE API'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={checkConnection}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(Object.entries(balance.total) as [string, number][]).filter(([_, val]) => val > 0).map(([asset, amount]) => (
              <motion.div 
                key={asset}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {asset.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{asset}</div>
                    <div className="text-xs text-slate-500">Available: {balance.free[asset] || 0}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    In Orders: {balance.used[asset] || 0}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {Object.keys(balance.total).length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No assets found with positive balance.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-slate-950 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Connection Failed</h2>
        <p className="text-slate-400 mb-6">
          Could not connect to OKX with the provided credentials.
        </p>
        
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-xs text-red-400 font-mono mb-6">
            {error}
          </div>
        )}

        <button 
          onClick={checkConnection}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    </div>
  );
}
