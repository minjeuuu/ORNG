import { MarketData, BacktestResult, StrategyConfig, StrategyStats } from "../../types";
import { calculateSMA, calculateReturns, calculateVolatility, calculateMomentum, calculateZScore, calculateTrendStrength } from "./factors";

export function runBacktest(data: MarketData[], config: StrategyConfig): BacktestResult[] {
  const prices = data.map(d => d.adjClose);
  const returns = calculateReturns(prices);
  
  // Calculate Indicators
  const smaFast = calculateSMA(prices, config.fastWindow);
  const smaSlow = calculateSMA(prices, config.slowWindow);
  const volatility = calculateVolatility(returns, 20); // 20-day vol for risk sizing
  
  // Factors for visualization
  const momentum = calculateMomentum(prices, 20);
  const zscore = calculateZScore(prices, 20);
  const trend = calculateTrendStrength(prices, 20);

  const results: BacktestResult[] = [];
  let equity = 1.0;
  let peakEquity = 1.0;

  for (let i = 0; i < data.length; i++) {
    // Signal Logic: MA Trend
    // Buy when Fast > Slow
    let signal = 0;
    if (!isNaN(smaFast[i]) && !isNaN(smaSlow[i])) {
      signal = smaFast[i] > smaSlow[i] ? 1 : 0;
    }

    // Risk Sizing: Volatility Targeting
    // Target Vol / Realized Vol
    let positionSize = 1.0;
    if (!isNaN(volatility[i]) && volatility[i] > 0) {
      positionSize = config.volTarget / volatility[i];
      // Cap leverage at 1.0 (no leverage for this demo) or higher if desired
      positionSize = Math.min(positionSize, 1.0); 
    }

    // Apply Strategy Return (lagged signal * current return)
    // We trade at Close, so signal from yesterday applies to today's return
    const prevSignal = i > 0 ? results[i-1].signal : 0;
    const prevPosSize = i > 0 ? results[i-1].positionSize : 0;
    
    const dailyRet = returns[i];
    const strategyRet = prevSignal * prevPosSize * dailyRet;

    equity = equity * (1 + strategyRet);
    
    if (equity > peakEquity) peakEquity = equity;
    const drawdown = (equity - peakEquity) / peakEquity;

    results.push({
      date: data[i].date,
      price: prices[i],
      signal,
      strategyReturn: strategyRet,
      equity,
      drawdown,
      positionSize,
      factors: {
        momentum: momentum[i],
        volatility: volatility[i],
        trend: trend[i],
        zscore: zscore[i]
      }
    });
  }

  return results;
}

export function calculateStats(results: BacktestResult[]): StrategyStats {
  const returns = results.map(r => r.strategyReturn);
  
  // Filter out the initial 0s or NaNs if any
  const activeReturns = returns.slice(1).filter(r => !isNaN(r)); 

  if (activeReturns.length === 0) {
    return {
      sharpe: 0,
      maxDrawdown: 0,
      totalReturn: 0,
      annualizedReturn: 0,
      annualizedVol: 0,
      winRate: 0,
      trades: 0
    };
  }

  const meanRet = activeReturns.reduce((a, b) => a + b, 0) / activeReturns.length;
  
  // Standard Deviation
  const squareDiffs = activeReturns.map(v => Math.pow(v - meanRet, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  const annualizedVol = stdDev * Math.sqrt(252);
  const annualizedReturn = Math.pow(1 + meanRet, 252) - 1;
  
  const totalReturn = results[results.length - 1].equity - 1;
  const maxDrawdown = Math.min(...results.map(r => r.drawdown));
  
  const wins = activeReturns.filter(r => r > 0).length;
  const winRate = activeReturns.length > 0 ? wins / activeReturns.length : 0;

  // Sharpe (assuming 0 risk-free for simplicity)
  const sharpe = annualizedVol === 0 ? 0 : annualizedReturn / annualizedVol;

  return {
    sharpe: isNaN(sharpe) ? 0 : sharpe,
    maxDrawdown: isNaN(maxDrawdown) ? 0 : maxDrawdown,
    totalReturn: isNaN(totalReturn) ? 0 : totalReturn,
    annualizedReturn: isNaN(annualizedReturn) ? 0 : annualizedReturn,
    annualizedVol: isNaN(annualizedVol) ? 0 : annualizedVol,
    winRate: isNaN(winRate) ? 0 : winRate,
    trades: 0 // TODO: Calculate actual trades based on signal flips
  };
}
