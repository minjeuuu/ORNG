import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock, ShieldCheck, Box, Link, ArrowRight, Copy } from 'lucide-react';

interface BlockExplorerProps {
  txId: string;
  onClose: () => void;
}

export function BlockExplorer({ txId, onClose }: BlockExplorerProps) {
  // Simulate fetching data based on TXID
  const isGenerated = txId.startsWith('GEN-') || txId.startsWith('TX-');
  const timestamp = new Date().toISOString();
  
  // Deterministic random values based on TXID for consistent display
  const seed = txId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const blockNumber = 18450000 + (seed % 10000);
  const confirmations = 12 + (seed % 50);
  const gasUsed = 21000 + (seed % 5000);
  const gasPrice = 15 + (seed % 20);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Box className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ORNG Scan</h2>
              <div className="text-xs text-orange-400 font-mono">ORNG Protocol Mainnet Explorer</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-lg">Transaction Successful</div>
              <div className="text-emerald-500/70 text-sm">Confirmed on ORNG Protocol Network</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Clock size={14} /> Timestamp
                </span>
                <span className="text-white font-mono text-sm">{new Date().toUTCString()}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Link size={14} /> Transaction Hash
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm break-all">{txId}</span>
                  <button className="text-slate-500 hover:text-white" title="Copy">
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Box size={14} /> Block
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-sm">{blockNumber}</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">{confirmations} Block Confirmations</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <ArrowRight size={14} /> From
                </span>
                <span className="text-orange-400 font-mono text-sm">ORNG Protocol Treasury (Hot Wallet)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <ArrowRight size={14} /> To
                </span>
                <span className="text-white font-mono text-sm">User Wallet (External)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <ShieldCheck size={14} /> Value
                </span>
                <span className="text-white font-bold text-lg">
                  Generated via ORNG Protocol
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-950/50 rounded-lg p-4 text-xs text-slate-500 font-mono">
            <div className="flex justify-between mb-1">
              <span>Gas Limit: 21,000</span>
              <span>Gas Used: {gasUsed} (100%)</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Price: {gasPrice} Gwei</span>
              <span>Txn Fee: {(gasUsed * gasPrice * 0.000000001).toFixed(5)} ETH</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
