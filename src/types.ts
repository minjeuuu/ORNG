
// Types for ORNG System

export interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface BacktestResult {
  date: string;
  price: number;
  signal: number; // 1 (Long), 0 (Neutral), -1 (Short)
  strategyReturn: number;
  equity: number;
  drawdown: number;
  positionSize: number;
  factors?: {
    momentum?: number;
    volatility?: number;
    trend?: number;
    zscore?: number;
    [key: string]: number | undefined;
  };
}

export interface StrategyStats {
  sharpe: number;
  maxDrawdown: number;
  totalReturn: number;
  annualizedReturn: number;
  annualizedVol: number;
  winRate: number;
  trades: number;
}

export interface FactorConfig {
  momentumWindow: number;
  volatilityWindow: number;
  trendWindow: number;
  zscoreWindow: number;
}

export interface StrategyConfig {
  fastWindow: number;
  slowWindow: number;
  volTarget: number;
  stopLoss: number;
}

declare global {
  interface Window {
    ethereum: any;
  }
}
