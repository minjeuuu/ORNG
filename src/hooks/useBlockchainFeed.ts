import { useState, useEffect } from 'react';

export interface BlockchainTx {
  hash: string;
  block: number;
  from: string;
  to: string;
  value: string;
  asset: string;
  status: 'CONFIRMED' | 'PENDING';
  timestamp: string;
}

export function useBlockchainFeed() {
  const [transactions, setTransactions] = useState<BlockchainTx[]>([]);

  useEffect(() => {
    const generateTx = () => {
      const assets = ['USDT', 'BTC', 'ETH', 'SOL', 'XRP'];
      const asset = assets[Math.floor(Math.random() * assets.length)];
      
      // Generate realistic TX Hash
      const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      
      // Generate realistic addresses
      const from = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const to = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''); // "My Wallet"

      // Massive values
      let value = '0';
      if (asset === 'USDT') value = (Math.random() * 500000 + 10000).toFixed(2);
      if (asset === 'BTC') value = (Math.random() * 5 + 0.1).toFixed(4);
      if (asset === 'ETH') value = (Math.random() * 50 + 1).toFixed(4);

      const newTx: BlockchainTx = {
        hash,
        block: 18230000 + Math.floor(Math.random() * 1000),
        from: `${from.substring(0, 6)}...${from.substring(36)}`,
        to: `OKX_VAULT_...${to.substring(36)}`,
        value,
        asset,
        status: 'CONFIRMED',
        timestamp: new Date().toLocaleTimeString()
      };

      setTransactions(prev => [newTx, ...prev].slice(0, 50)); // Keep last 50
    };

    // High frequency updates
    const interval = setInterval(generateTx, 800);
    return () => clearInterval(interval);
  }, []);

  return transactions;
}
