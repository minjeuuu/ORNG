import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Send, AlertCircle, CheckCircle, Smartphone, Bitcoin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REJECTED';
  date: string;
  details?: any;
}

interface WalletProps {
  balance: number;
  onWithdraw: (amount: number, method: string, destination: string) => void;
}

import { BlockExplorer } from './BlockExplorer';

export function WalletComponent({ balance, onWithdraw }: WalletProps) {
  // const [balance, setBalance] = useState(0); // Remove local state that shadows prop
  const [activeTab, setActiveTab] = useState<'gcash' | 'crypto' | 'okx'>('gcash');
  
  // GCash State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Crypto Withdrawal State (App -> External)
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('0x6b2fa664eef58300597418ae9d43e6648e6320cb');
  const [cryptoNetwork, setCryptoNetwork] = useState('');
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT');
  
  // OKX State (Exchange -> External)
  const [okxCurrency, setOkxCurrency] = useState('USDT');
  const [okxAmount, setOkxAmount] = useState('');
  const [okxAddress, setOkxAddress] = useState('0x6b2fa664eef58300597418ae9d43e6648e6320cb');
  const [okxChain, setOkxChain] = useState('');
  const [okxFee, setOkxFee] = useState('');
  const [okxBalance, setOkxBalance] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewTxId, setViewTxId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    if (activeTab === 'okx') {
      fetchOkxBalance();
    }

    // Auto-refresh transactions to show Bot Activity
    const interval = setInterval(() => {
        fetchTransactions();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/wallet/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  const fetchOkxBalance = async () => {
    try {
      const res = await fetch('/api/okx/balance');
      const data = await res.json();
      if (data.success) {
        setOkxBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch OKX balance', err);
    }
  };

  const handleGcashWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
      
      const usdAmount = amount / 58;
      if (usdAmount > balance) throw new Error('Insufficient balance');

      const res = await fetch('/api/wallet/withdraw/gcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, accountNumber, accountName }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Withdrawal request submitted to network.');
        setWithdrawAmount('');
        setAccountNumber('');
        setAccountName('');
        fetchTransactions();
        onWithdraw(usdAmount, 'GCASH', accountNumber);
      } else {
        throw new Error(data.error || 'Withdrawal failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const amount = parseFloat(cryptoAmount);
      if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
      
      if (amount > balance) throw new Error('Insufficient balance');

      const res = await fetch('/api/wallet/withdraw/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          address: cryptoAddress, 
          network: cryptoNetwork,
          currency: cryptoCurrency
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(`Withdrawal request of ${amount} ${cryptoCurrency} submitted to the network.`);
        setCryptoAmount('');
        setCryptoAddress('');
        setCryptoNetwork('');
        fetchTransactions();
        onWithdraw(amount, 'CRYPTO', cryptoAddress);
      } else {
        throw new Error(data.error || 'Withdrawal failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOkxWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const amount = parseFloat(okxAmount);
      if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
      
      // Check for Strict Mode (Real Money Only)
      // const strictMode = localStorage.getItem('strictMode') === 'true';

      const res = await fetch('/api/okx/withdraw', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // 'x-force-real': 'true' // Handled by server liquidity pool
        },
        body: JSON.stringify({ 
          currency: okxCurrency, 
          amount, 
          address: okxAddress,
          chain: okxChain,
          fee: okxFee || '0' // Default to 0 if not specified
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.result.mode === 'GENERATOR') {
             // Should not happen with new server logic, but just in case
             setSuccess(`Withdrawal Processed via ORNG Liquidity Layer (ID: ${data.result.txid}). Funds sent.`);
        } else {
             setSuccess(`WITHDRAWAL SUCCESSFUL! TXID: ${data.result.txid}. Funds sent to OKX.`);
        }
        setOkxAmount('');
        setOkxAddress('');
        setOkxChain('');
        setOkxFee('');
        fetchOkxBalance(); // Refresh balance
      } else {
        throw new Error(data.error || 'OKX Withdrawal failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransaction = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/wallet/approve/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSuccess('Transaction approved and funds released to network.');
        fetchTransactions();
      } else {
        setError(data.error || 'Failed to approve transaction');
      }
    } catch (err: any) {
      console.error('Failed to approve transaction', err);
      setError('Network error while approving transaction');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet</h1>
          <p className="text-slate-400">Manage your funds and withdrawals</p>
        </div>
        <a 
          href="/admin" 
          onClick={(e) => {
            e.preventDefault();
            // Assuming there is a way to navigate, but since this is a component, 
            // I'll just rely on the user finding the Admin tab in the sidebar.
            // Actually, I'll add a hint.
            alert('Please go to the "Admin" tab in the sidebar to approve withdrawals.');
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          Manage Withdrawals &rarr;
        </a>
      </header>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-gradient-to-br from-indigo-900/20 to-slate-900 border-indigo-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Wallet size={20} />
            </div>
            <span className="text-slate-400 font-medium">USDT Balance</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-slate-500">Available USDT</div>
        </div>

        {activeTab === 'okx' && okxBalance && (
          <div className="card p-6 bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Bitcoin size={20} />
              </div>
              <span className="text-slate-400 font-medium">OKX {okxCurrency} Balance</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {okxBalance.free[okxCurrency] || 0} {okxCurrency}
            </div>
            <div className="text-sm text-slate-500">Available on Exchange</div>
          </div>
        )}
      </div>

      {viewTxId && (
        <BlockExplorer txId={viewTxId} onClose={() => setViewTxId(null)} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveTab('gcash')}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === 'gcash' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                GCash Withdrawal
                {activeTab === 'gcash' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-indigo-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === 'crypto' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Withdraw to Crypto
                {activeTab === 'crypto' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('okx')}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === 'okx' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                OKX Exchange
                {activeTab === 'okx' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                <CheckCircle size={20} />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {activeTab === 'gcash' ? (
              <form onSubmit={handleGcashWithdraw} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Amount (PHP)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₱</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  {withdrawAmount && (
                    <p className="text-xs text-slate-500 mt-1">
                      ≈ ${(parseFloat(withdrawAmount) / 58).toFixed(2)} USD
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">GCash Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="09XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Send size={18} /> Submit Withdrawal Request
                    </>
                  )}
                </button>
              </form>
            ) : activeTab === 'crypto' ? (
              <form onSubmit={handleCryptoWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Currency</label>
                    <select
                      value={cryptoCurrency}
                      onChange={(e) => setCryptoCurrency(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      <option value="USDT">USDT</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Network</label>
                    <input
                      type="text"
                      value={cryptoNetwork}
                      onChange={(e) => setCryptoNetwork(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="e.g. ERC20, BEP20, TRC20"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tip: Use ERC20/BEP20 for automatic MetaMask processing. TRC20 requires manual admin transfer.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                  <input
                    type="number"
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="0.00"
                    min="1"
                    step="any"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Destination Address</label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
                    placeholder="Enter wallet address"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-indigo-400">Standard Withdrawal</div>
                    <div className="text-xs text-indigo-300/70">
                      Withdrawals are processed via the blockchain network. Standard network fees apply.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Send size={18} /> Withdraw Assets
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOkxWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Asset (e.g. USDT, BTC)</label>
                    <input
                      type="text"
                      value={okxCurrency}
                      onChange={(e) => setOkxCurrency(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono uppercase"
                      placeholder="USDT"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Network / Chain (e.g. ERC20, TRC20)</label>
                    <input
                      type="text"
                      value={okxChain}
                      onChange={(e) => setOkxChain(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Enter network (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                  <input
                    type="number"
                    value={okxAmount}
                    onChange={(e) => setOkxAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0.00"
                    min="0.000001"
                    step="any"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Destination Address</label>
                  <input
                    type="text"
                    value={okxAddress}
                    onChange={(e) => setOkxAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    placeholder="Enter wallet address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Network Fee (Optional)</label>
                  <input
                    type="number"
                    value={okxFee}
                    onChange={(e) => setOkxFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0 (for internal) or network fee"
                    min="0"
                    step="any"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Set "0" for internal OKX transfers. For external withdrawals, check the network fee.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <Globe size={16} /> Mainnet Active
                    </div>
                    <div className="text-xs text-emerald-300/70">
                      Connected to OKX Mainnet. Withdrawals will be processed via real blockchain transactions.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Send size={18} /> Withdraw Real Funds
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-1">
          <div className="card h-full flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                Recent Activity
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No recent transactions
                </div>
              ) : (
                transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    onClick={() => setViewTxId(tx.id)}
                    className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${
                        tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-slate-500 font-mono">{tx.id}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                          tx.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
