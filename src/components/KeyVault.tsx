import React, { useState, useEffect } from 'react';
import { Key, Shield, RefreshCw, Copy, CheckCircle, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeyVaultProps {
  onInjectKey: (key: string, secret: string) => void;
}

export function KeyVault({ onInjectKey }: KeyVaultProps) {
  const [keys, setKeys] = useState<{id: string, secret: string, status: 'ACTIVE' | 'REVOKED' | 'UNUSED'}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeKeyIndex, setActiveKeyIndex] = useState<number | null>(null);

  const generateKeys = () => {
    setIsGenerating(true);
    const newKeys = [];
    
    // Generate 1000 keys
    for (let i = 0; i < 1000; i++) {
      const id = `PK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const secret = Array(40).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
      newKeys.push({ id, secret, status: 'UNUSED' as const });
    }

    // Simulate processing time
    setTimeout(() => {
      setKeys(prev => [...newKeys, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  const activateKey = (index: number) => {
    setActiveKeyIndex(index);
    const key = keys[index];
    onInjectKey(key.id, key.secret);
    
    // Update status
    const updatedKeys = [...keys];
    updatedKeys[index].status = 'ACTIVE';
    if (activeKeyIndex !== null && activeKeyIndex !== index) {
      updatedKeys[activeKeyIndex].status = 'REVOKED';
    }
    setKeys(updatedKeys);
  };

  return (
    <div className="card p-6 h-full flex flex-col relative overflow-hidden">
      <div className="relative z-10 mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="text-orange-500" size={20} />
            KEY VAULT <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded border border-orange-500/20">GENERATOR</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate synthetic API credentials for ORNG simulation protocols.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Available Keys</div>
          <div className="text-2xl font-mono font-bold text-white">{keys.length.toLocaleString()}</div>
        </div>
      </div>

      {/* Generator Action */}
      <div className="mb-6 relative z-10">
        <button 
          onClick={generateKeys}
          disabled={isGenerating}
          className="w-full py-4 bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800 transition-all rounded-xl flex flex-col items-center justify-center gap-2 group"
        >
          {isGenerating ? (
            <RefreshCw className="animate-spin text-orange-500" size={24} />
          ) : (
            <Shield className="text-slate-400 group-hover:text-orange-500 transition-colors" size={24} />
          )}
          <span className="text-xs font-bold tracking-widest text-slate-400 group-hover:text-white">
            {isGenerating ? 'CRYPTOGRAPHIC GENERATION IN PROGRESS...' : 'GENERATE 1,000 SYNTHETIC KEYS'}
          </span>
        </button>
      </div>

      {/* Key List */}
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col relative z-10">
        <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Credential Registry</span>
          <span className="text-[10px] font-mono text-slate-600">{keys.length > 0 ? 'READY' : 'EMPTY'}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {keys.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-700 text-xs italic">
              No keys generated. Initiate generation sequence.
            </div>
          ) : (
            keys.slice(0, 100).map((key, idx) => ( // Only render first 100 for performance
              <div 
                key={idx}
                onClick={() => activateKey(idx)}
                className={`p-3 rounded border cursor-pointer transition-all flex justify-between items-center group ${
                  activeKeyIndex === idx 
                    ? 'bg-orange-500/10 border-orange-500/30' 
                    : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 rounded ${
                      activeKeyIndex === idx ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {activeKeyIndex === idx ? 'ACTIVE' : 'UNUSED'}
                    </span>
                    <span className="font-mono text-xs text-slate-300">{key.id}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-600 truncate w-48">
                    {key.secret.substring(0, 20)}...
                  </span>
                </div>
                
                {activeKeyIndex === idx ? (
                  <Unlock size={14} className="text-orange-500" />
                ) : (
                  <Lock size={14} className="text-slate-600 group-hover:text-slate-400" />
                )}
              </div>
            ))
          )}
          {keys.length > 100 && (
            <div className="text-center py-4 text-xs text-slate-600">
              ...and {keys.length - 100} more keys available in vault.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
