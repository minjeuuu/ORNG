import React from 'react';
import { useBlockchainFeed } from '../hooks/useBlockchainFeed';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BlockchainFeed() {
  const transactions = useBlockchainFeed();

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-slate-200 text-sm tracking-wide">LIVE BLOCKCHAIN FEED</h3>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          MAINNET • {transactions.length > 0 ? transactions[0].block : 'SYNCING'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="group flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-800/50 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${tx.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {tx.status === 'CONFIRMED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                      {tx.hash.substring(0, 8)}...{tx.hash.substring(60)}
                    </span>
                    <ExternalLink size={10} className="text-slate-600 group-hover:text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex gap-2">
                    <span>Block: {tx.block}</span>
                    <span>•</span>
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-200">
                  +{parseFloat(tx.value).toLocaleString()} <span className="text-slate-500 text-xs">{tx.asset}</span>
                </div>
                <div className="text-[10px] text-emerald-500/80 font-mono">
                  INCOMING LIQUIDITY
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
