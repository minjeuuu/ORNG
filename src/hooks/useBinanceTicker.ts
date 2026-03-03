import { useState, useEffect, useRef } from 'react';

interface TickerData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  isLive: boolean;
}

export function useBinanceTicker(symbols: string[] = ['btcusdt', 'ethusdt', 'solusdt', 'xrpusdt']) {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Binance Public Stream
    const streams = symbols.map(s => `${s}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('[BINANCE] Connected to Live Stream');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Binance Ticker Format:
      // s: symbol, c: last price, P: price change percent, v: volume
      
      setTickers(prev => ({
        ...prev,
        [data.s]: {
          symbol: data.s,
          price: parseFloat(data.c),
          change24h: parseFloat(data.P),
          volume: parseFloat(data.v),
          isLive: true
        }
      }));
    };

    wsRef.current.onerror = (err) => {
      console.error('[BINANCE] WebSocket Error:', err);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [JSON.stringify(symbols)]);

  return tickers;
}
