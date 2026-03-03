import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Terminal, Sparkles } from 'lucide-react';
import { StrategyStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AIAnalystProps {
  stats: StrategyStats | null;
  config: any;
}

export function AIAnalyst({ stats, config }: AIAnalystProps) {
  const [insights, setInsights] = useState<{type: 'warning' | 'success' | 'info', text: string}[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!stats) return;

    setIsThinking(true);
    setInsights([]);

    // Simulate AI analysis delay
    const timer = setTimeout(() => {
      const newInsights = [];

      // Sharpe Analysis
      if (stats.sharpe > 3.0) {
        newInsights.push({ type: 'warning', text: `Sharpe Ratio of ${stats.sharpe.toFixed(2)} is suspiciously high. Check for look-ahead bias in signal generation.` });
      } else if (stats.sharpe > 1.5) {
        newInsights.push({ type: 'success', text: `Strong risk-adjusted returns (Sharpe ${stats.sharpe.toFixed(2)}). Strategy passes baseline ORNG viability.` });
      } else if (stats.sharpe < 0.5) {
        newInsights.push({ type: 'warning', text: `Sharpe ${stats.sharpe.toFixed(2)} indicates poor edge. Consider adding a volatility filter or regime detection.` });
      }

      // Drawdown Analysis
      if (stats.maxDrawdown < -0.25) {
        newInsights.push({ type: 'warning', text: `Max Drawdown ${(stats.maxDrawdown * 100).toFixed(1)}% exceeds institutional tolerance. Tighten volatility targeting or stop-loss.` });
      }

      // Parameter Analysis
      if (config.fastWindow < 5) {
        newInsights.push({ type: 'info', text: `Fast MA window (${config.fastWindow}) is very short. High turnover may erode edge via transaction costs.` });
      }

      // Volatility Targeting
      if (stats.annualizedVol > config.volTarget * 1.5) {
        newInsights.push({ type: 'warning', text: `Realized Vol (${(stats.annualizedVol * 100).toFixed(1)}%) significantly exceeds Target (${(config.volTarget * 100).toFixed(0)}%). Risk sizing lag detected.` });
      }

      setInsights(newInsights as any);
      setIsThinking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [stats, config]);

  return (
    <div className="card h-full flex flex-col bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Brain size={16} className="text-indigo-400" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">ORNG Intelligence</h3>
        </div>
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
            <Sparkles size={12} />
            <span>Analyzing...</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <AnimatePresence>
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-lg border text-xs leading-relaxed flex gap-3 ${
                insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' :
                insight.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' :
                'bg-slate-800/50 border-slate-700 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {insight.type === 'warning' ? <AlertTriangle size={14} className="text-amber-500" /> :
                 insight.type === 'success' ? <CheckCircle size={14} className="text-emerald-500" /> :
                 <Terminal size={14} className="text-slate-400" />}
              </div>
              <span>{insight.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isThinking && insights.length === 0 && (
          <div className="text-center text-slate-600 text-xs py-8">
            Waiting for simulation data...
          </div>
        )}
      </div>
    </div>
  );
}
