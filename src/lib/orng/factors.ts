import { MarketData } from "../../types";

// --- Math Helpers ---

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function std(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

export function rolling<T>(arr: T[], window: number, fn: (slice: T[]) => number): number[] {
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const slice = arr.slice(i - window + 1, i + 1);
      result.push(fn(slice));
    }
  }
  return result;
}

// --- Factors ---

export function calculateMomentum(prices: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window) {
      result.push(NaN);
    } else {
      const current = prices[i];
      const past = prices[i - window];
      result.push((current - past) / past);
    }
  }
  return result;
}

export function calculateVolatility(returns: number[], window: number): number[] {
  // Annualized volatility (assuming daily returns)
  return rolling(returns, window, (slice) => std(slice) * Math.sqrt(252));
}

export function calculateSMA(prices: number[], window: number): number[] {
  return rolling(prices, window, mean);
}

export function calculateZScore(prices: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const slice = prices.slice(i - window + 1, i + 1);
      const avg = mean(slice);
      const dev = std(slice);
      result.push(dev === 0 ? 0 : (prices[i] - avg) / dev);
    }
  }
  return result;
}

export function calculateTrendStrength(prices: number[], window: number): number[] {
  // Slope of SMA
  const sma = calculateSMA(prices, window);
  const result: number[] = [];
  for (let i = 0; i < sma.length; i++) {
    if (i === 0 || isNaN(sma[i]) || isNaN(sma[i-1])) {
      result.push(NaN);
    } else {
      result.push(sma[i] - sma[i-1]);
    }
  }
  return result;
}

export function calculateReturns(prices: number[]): number[] {
  const result: number[] = [0]; // First day return is 0
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i-1];
    const curr = prices[i];
    if (!prev || isNaN(prev) || !curr || isNaN(curr)) {
      result.push(0);
    } else {
      result.push((curr - prev) / prev);
    }
  }
  return result;
}
