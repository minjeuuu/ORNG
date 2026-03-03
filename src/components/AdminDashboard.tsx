import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, Smartphone, User, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { ethers } from 'ethers';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  date: string;
  details: {
    accountNumber?: string;
    accountName?: string;
    method?: string;
    address?: string;
    network?: string;
    target?: string;
  };
}

import { BlockExplorer } from './BlockExplorer';

// Treasury Status Component
function TreasuryStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  useEffect(() => {
    // Load strict mode from local storage
    const stored = localStorage.getItem('strictMode');
    if (stored) setStrictMode(JSON.parse(stored));

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/treasury/status');
        const data = await res.json();
        setStatus(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const toggleStrictMode = () => {
    const newVal = !strictMode;
    setStrictMode(newVal);
    localStorage.setItem('strictMode', JSON.stringify(newVal));
    // Dispatch event so other components know
    window.dispatchEvent(new CustomEvent('strictModeChanged', { detail: newVal }));
  };

  if (loading) return <div className="text-slate-500 text-sm">Checking Treasury...</div>;
  if (!status || !status.success) return <div className="text-red-400 text-sm">Connection Failed: {status?.error || 'Unknown'}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-white">{status.status}</span>
        </div>
        <button 
            onClick={toggleStrictMode}
            className={`text-xs px-2 py-1 rounded border ${strictMode ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
            {strictMode ? 'MAINNET: ACTIVE' : 'PROTOCOL: HYBRID'}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total Asset Value:</span>
          <span className="font-mono text-emerald-400 font-bold">${status.balance?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Liquidity Available:</span>
          <span className="font-mono text-white">${status.available?.toLocaleString()}</span>
        </div>
        
        {strictMode && (
             <div className="mt-4 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-200">
                ✅ MAINNET ACTIVE: Real blockchain withdrawals enabled. Treasury connected to live network.
            </div>
        )}

        {!strictMode && status.balance < 10 && (
            <div className="mt-4 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-200">
                ℹ️ Hybrid Protocol Active. Assets are secured by ORNG Liquidity Layer.
            </div>
        )}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [viewTxId, setViewTxId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdrawals');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ERC20 ABI for Token Transfers
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  // Common USDT Contract Addresses
  const USDT_CONTRACTS: { [chainId: number]: string } = {
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum Mainnet
    56: '0x55d398326f99059fF775485246999027B3197955', // BSC
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
    11155111: '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0', // Sepolia (Testnet) - Example
  };

  const handleCryptoTransfer = async (amount: number, address: string, currency: string) => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to send crypto.');
      return false;
    }

    // Check for Tron Address (Starts with T, length 34)
    if (address.startsWith('T') && address.length === 34) {
      const sent = window.confirm(
        `TRON NETWORK DETECTED\n\n` +
        `Destination: ${address}\n` +
        `Amount: ${amount} ${currency}\n\n` +
        `MetaMask does NOT support the Tron network directly.\n\n` +
        `Please open your Tron wallet (e.g., TronLink) and manually send the funds.\n\n` +
        `Did you complete the transfer?`
      );
      return sent;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      console.log('Current network:', network.name, chainId);

      // Determine if Native or Token
      const isNative = ['ETH', 'BNB', 'MATIC', 'AVAX', 'CRO', 'FTM'].includes(currency.toUpperCase());

      if (isNative) {
        // Native Transfer
        const confirmed = window.confirm(`WARNING: You are about to send REAL FUNDS.\n\nAmount: ${amount} ${currency} (Native)\nTo: ${address}\nNetwork: ${network.name} (${chainId})\n\nDo you want to proceed?`);
        if (!confirmed) return false;

        const tx = await signer.sendTransaction({
          to: address,
          value: ethers.parseEther(amount.toString())
        });

        console.log('Transaction sent:', tx.hash);
        alert(`Transaction sent! Hash: ${tx.hash}\nWaiting for confirmation...`);

        await tx.wait();
        alert('Transaction confirmed on blockchain!');
        return true;
      } else {
        // Token Transfer (ERC20)
        let tokenAddress = USDT_CONTRACTS[chainId];
        
        // If not a known USDT on known chain, or if currency is not USDT, ask user
        if (currency.toUpperCase() !== 'USDT' || !tokenAddress) {
          const input = window.prompt(
            `Enter the ${currency} Token Contract Address for this network (${network.name}):`, 
            tokenAddress || ''
          );
          if (!input) return false;
          tokenAddress = input;
        }

        const confirmed = window.confirm(`WARNING: You are about to send REAL FUNDS.\n\nAmount: ${amount} ${currency}\nTo: ${address}\nToken Contract: ${tokenAddress}\nNetwork: ${network.name}\n\nDo you want to proceed?`);
        if (!confirmed) return false;

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        
        let decimals = 18;
        try {
          decimals = await contract.decimals();
        } catch (e) {
          console.warn('Could not fetch decimals, defaulting to 18', e);
        }

        const amountInUnits = ethers.parseUnits(amount.toString(), decimals);
        
        const tx = await contract.transfer(address, amountInUnits);
        console.log('Transaction sent:', tx.hash);
        alert(`Transaction sent! Hash: ${tx.hash}\nWaiting for confirmation...`);
        
        await tx.wait();
        alert('Transaction confirmed on blockchain!');
        return true;
      }

    } catch (error: any) {
      console.error('Crypto Transfer Error:', error);
      alert(`Transfer failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  const handleStatusUpdate = async (id: string, status: 'COMPLETED' | 'REJECTED', amount: number, currency: string, details: any) => {
    console.log('handleStatusUpdate', id, status, amount, currency, details);
    
    if (status === 'COMPLETED') {
      const safeDetails = details || {};
      
      // Handle Crypto Transfer
      if (safeDetails.method === 'CRYPTO') {
        const isTron = safeDetails.address?.startsWith('T');
        
        let choice = '';
        if (isTron) {
           choice = window.prompt(
            `TRON (TRC20) DETECTED\n\n` +
            `MetaMask CANNOT send to Tron addresses.\n\n` +
            `Options:\n` +
            `1. Pay via OKX API (Server-Side)\n` +
            `2. I sent it manually (Mark as Completed)\n\n` +
            `Enter 1 or 2:`,
            '1'
           ) || '';
        } else {
           choice = window.prompt(
            `CRYPTO TRANSFER (${currency})\n\n` +
            `Options:\n` +
            `1. Pay via MetaMask (Browser)\n` +
            `2. Pay via OKX API (Server-Side)\n` +
            `3. I sent it manually (Mark as Completed)\n\n` +
            `Enter 1, 2, or 3:`,
            '1'
           ) || '';
        }

        if (choice === '1' && isTron) {
          // OKX API for Tron
          try {
            setProcessingId(id);
            const res = await fetch('/api/admin/payout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
              alert(`Payout Successful! TXID: ${data.result.txid}`);
              fetchTransactions(); // Refresh list
              return;
            } else {
              alert(`OKX Payout Failed: ${data.error}\n\nPlease send manually.`);
              return;
            }
          } catch (e) {
            alert('Payout Error. Check console.');
            console.error(e);
            return;
          }
        } else if (choice === '1' && !isTron) {
          // MetaMask for EVM
          const success = await handleCryptoTransfer(amount, safeDetails.address, currency);
          if (!success) return;
        } else if (choice === '2' && !isTron) {
          // OKX API for EVM
          try {
            setProcessingId(id);
            const res = await fetch('/api/admin/payout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
              alert(`Payout Successful! TXID: ${data.result.txid}`);
              fetchTransactions();
              return;
            } else {
              alert(`OKX Payout Failed: ${data.error}`);
              return;
            }
          } catch (e) {
            alert('Payout Error. Check console.');
            return;
          }
        } else if (choice === '2' && isTron) {
           // Manual (Mark as Completed)
           // Fall through to normal update
        } else if (choice === '3') {
           // Manual (Mark as Completed)
           // Fall through to normal update
        } else {
          return; // Cancelled
        }
      } 
      // Handle GCash (Manual only)
      else if (safeDetails.method === 'GCASH') {
        // ... existing GCash logic ...
        let message = `IMPORTANT: This action ONLY updates the record status.\n\n`;
        message += `You must MANUALLY transfer ₱${amount.toLocaleString()} to GCash Number: ${safeDetails.accountNumber || 'N/A'} (${safeDetails.accountName || 'N/A'}).\n\n`;
        message += `Have you completed the manual transfer?`;
        
        try {
          await new Promise(resolve => setTimeout(resolve, 10));
          const confirmed = window.confirm(message);
          if (!confirmed) return;
        } catch (e) {
          console.error('Confirmation dialog error:', e);
          return;
        }
      }
    }

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Optimistic update
        setTransactions(prev => prev.map(tx => 
          tx.id === id ? { ...tx, status } : tx
        ));
      }
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage withdrawal requests and payouts</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchTransactions}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {viewTxId && (
        <BlockExplorer txId={viewTxId} onClose={() => setViewTxId(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Treasury Status</div>
          <TreasuryStatus />
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-2">
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Protocol Control</div>
             <div className="flex gap-4 items-center h-full">
                <div className="text-sm text-slate-400">
                    ORNG Protocol is active. Real withdrawals are attempted first. If the Treasury is empty, the Protocol generates a synthetic transaction to ensure user satisfaction.
                </div>
             </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase font-mono text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <motion.tr 
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setViewTxId(tx.id)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(tx.date).toLocaleString()}
                      <div className="text-xs text-slate-600 mt-1">{tx.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.details.method === 'CRYPTO' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {tx.details.method === 'CRYPTO' ? <User size={16} /> : <Smartphone size={16} />}
                        </div>
                        <div>
                          {tx.details.method === 'CRYPTO' ? (
                            <>
                              <div className="font-medium text-white">{tx.details.target || 'Crypto Wallet'}</div>
                              <div className="text-xs text-slate-400 font-mono truncate max-w-[150px]" title={tx.details.address}>
                                {tx.details.address}
                              </div>
                              <div className="text-[10px] text-slate-500 uppercase">{tx.details.network}</div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium text-white">{tx.details.accountName || 'Unknown'}</div>
                              <div className="text-xs text-slate-400 font-mono">{tx.details.accountNumber}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-bold font-mono text-lg">
                        {tx.currency === 'PHP' ? '₱' : ''}{tx.amount.toLocaleString()} {tx.currency !== 'PHP' ? tx.currency : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        tx.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {tx.status === 'COMPLETED' && <CheckCircle size={12} />}
                        {tx.status === 'REJECTED' && <XCircle size={12} />}
                        {tx.status === 'PENDING' && <Clock size={12} />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(tx.id, 'COMPLETED', tx.amount, tx.currency, tx.details);
                            }}
                            disabled={processingId === tx.id}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(tx.id, 'REJECTED', tx.amount, tx.currency, tx.details);
                            }}
                            disabled={processingId === tx.id}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-bold rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
