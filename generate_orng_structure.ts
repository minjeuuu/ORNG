import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('orng_lab');

// Define the folder structure
const folders = [
  'config',
  'data/raw',
  'data/cleaned',
  'data/adjusted',
  'data/audits',
  'foundation/probability',
  'foundation/statistics',
  'foundation/linear_algebra',
  'foundation/time_series',
  'foundation/market_microstructure',
  'factors/momentum',
  'factors/mean_reversion',
  'factors/volatility',
  'factors/trend',
  'factors/liquidity',
  'factors/cross_sectional',
  'strategies/single_asset',
  'strategies/multi_asset',
  'strategies/ensembles',
  'strategies/stat_arb',
  'risk/volatility_target',
  'risk/drawdown',
  'risk/exposure',
  'risk/stress_tests',
  'validation/walk_forward',
  'validation/monte_carlo',
  'validation/regimes',
  'automation/pipelines',
  'automation/schedulers',
  'automation/logs',
  'archive/daily_logs',
  'archive/failed_ideas',
  'archive/postmortems',
  'intelligence/prompts',
  'intelligence/critiques',
  'intelligence/diagnostics',
  'publication/tear_sheets',
  'publication/papers',
  'publication/summaries',
  'scripts',
  'notebooks',
  'examples/example_logs'
];

// Define file contents from the PDF
const files = {
  'README.md': `# ORNG Quant Research Lab

ORNG is a zero-capital quantitative research system.

## Structure
- foundation/: math, statistics, and market theory
- data/: raw, cleaned, and adjusted datasets
- factors/: factor definitions and formulas
- strategies/: baseline, multi-asset, ensembles, and stat arb
- risk/: risk management modules
- validation/: walk forward, Monte Carlo, regimes
- automation/: pipelines and scheduled runs
- archive/: daily logs, failed strategies, postmortems
- intelligence/: AI prompts, critiques, diagnostics
- publication/: tear sheets, papers, summaries

## Setup
\`\`\`bash
python -m venv quant_env
source quant_env/bin/activate
pip install -r requirements.txt
\`\`\`

## Running the Pipeline
\`\`\`bash
python automation/pipelines/run_pipeline.py
\`\`\`
`,

  'requirements.txt': `numpy
pandas
scipy
scikit-learn
statsmodels
matplotlib
yfinance
vectorbt
backtrader
torch
jupyter
pyyaml
alpaca-trade-api
seaborn
tk
`,

  'config/config.yaml': `project:
  name: ORNG
  mode: research_only

data:
  source: yfinance
  assets:
    - SPY
    - QQQ
    - IWM
  start_date: 2010-01-01
  frequency: 1D

strategy:
  type: moving_average_trend
  fast_window: 20
  slow_window: 100

risk:
  max_exposure: 1.0
  target_volatility: 0.01
  stop_loss: 0.15

validation:
  train_split: 0.7
  walk_forward_windows: 5
  monte_carlo_runs: 500

output:
  save_reports: true
  path: publication/
`,

  'config/alpaca_credentials_example.json': `{
  "API_KEY": "YOUR_ALPACA_API_KEY",
  "API_SECRET": "YOUR_ALPACA_SECRET_KEY",
  "BASE_URL": "https://paper-api.alpaca.markets"
}`,

  // --- Factors ---
  'factors/momentum/time_series_momentum.py': `def momentum(close, window=20):
    return close.pct_change(window)
`,

  'factors/mean_reversion/zscore.py': `def zscore(series, window=20):
    mean = series.rolling(window).mean()
    std = series.rolling(window).std()
    return (series - mean) / std
`,

  'factors/volatility/realized_vol.py': `def realized_vol(returns, window=20):
    return returns.rolling(window).std() * (252 ** 0.5)
`,

  'factors/trend/trend_strength.py': `def trend_strength(close, window=20):
    return close.diff(window)
`,

  'factors/liquidity/volume_avg.py': `def avg_volume(volume, window=20):
    return volume.rolling(window).mean()
`,

  'factors/cross_sectional/ranker.py': `def cross_rank(df, window=20):
    momentum = df.pct_change(window)
    return momentum.rank(axis=1, ascending=False)
`,

  // --- Strategies ---
  'strategies/single_asset/ma_trend.py': `import pandas as pd

def apply_strategy(data, fast=20, slow=100):
    data["ma_fast"] = data["Close"].rolling(fast).mean()
    data["ma_slow"] = data["Close"].rolling(slow).mean()
    data["signal"] = (data["ma_fast"] > data["ma_slow"]).astype(int)
    data["returns"] = data["Close"].pct_change()
    data["strategy_returns"] = data["signal"].shift(1) * data["returns"]
    return data.dropna()
`,

  'strategies/multi_asset/allocation.py': `def allocate_by_score(scores):
    positive = scores.clip(lower=0)
    weights = positive.div(positive.sum(axis=1), axis=0)
    return weights.fillna(0)
`,

  'strategies/ensembles/simple_ensemble.py': `import pandas as pd

def ensemble(signals):
    df = pd.concat(signals, axis=1)
    return (df.mean(axis=1) > 0.5).astype(int)
`,

  'strategies/stat_arb/pair_trade.py': `import numpy as np

def pair_signal(z):
    signal = np.zeros(len(z))
    signal[z > 2] = -1
    signal[z < -2] = 1
    return signal
`,

  // --- Risk ---
  'risk/volatility_target/target.py': `def vol_target(returns, target=0.01, window=20):
    vol = returns.rolling(window).std()
    size = target / vol
    return size.clip(0, 1)
`,

  'risk/drawdown/drawdown.py': `def max_drawdown(returns):
    equity = (1 + returns).cumprod()
    peak = equity.cummax()
    dd = (equity - peak) / peak
    return dd.min()
`,

  // --- Validation ---
  'validation/walk_forward/basic.py': `def walk_forward_split(data, splits=5):
    size = len(data)
    step = size // splits
    windows = []
    for i in range(splits - 1):
        train = data.iloc[: step * (i + 1)]
        test = data.iloc[step * (i + 1): step * (i + 2)]
        windows.append((train, test))
    return windows
`,

  'validation/monte_carlo/bootstrap.py': `import numpy as np

def bootstrap_returns(returns, runs=500):
    results = []
    for _ in range(runs):
        sampled = np.random.choice(returns, size=len(returns), replace=True)
        results.append(sampled.mean() / sampled.std())
    return np.array(results)
`,

  'validation/regimes/vol_regime.py': `def volatility_regime(returns, window=20):
    vol = returns.rolling(window).std()
    threshold = vol.median()
    return (vol > threshold).astype(int)
`,

  // --- Automation ---
  'automation/pipelines/run_pipeline.py': `import yaml
import yfinance as yf
import sys
import os

# Add root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from strategies.single_asset.ma_trend import apply_strategy
from risk.volatility_target.target import vol_target

def load_config(path='config/config.yaml'):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def run():
    try:
        cfg = load_config()
    except:
        # Fallback if config not found relative to execution
        cfg = load_config('../../config/config.yaml')

    asset = cfg['data']['assets'][0]
    print(f"Running pipeline for {asset}...")
    
    data = yf.download(asset, start=cfg['data']['start_date'], progress=False)
    
    if data.empty:
        print("No data downloaded.")
        return

    data = apply_strategy(data, cfg['strategy']['fast_window'], cfg['strategy']['slow_window'])
    data['position_size'] = vol_target(data['Close'].pct_change(), cfg['risk']['target_volatility'])
    data['risk_adj_returns'] = data['strategy_returns'] * data['position_size']
    
    sharpe = data['risk_adj_returns'].mean() / data['risk_adj_returns'].std() * (252 ** 0.5)
    
    cum_ret = (1 + data['risk_adj_returns']).cumprod()
    max_dd = (cum_ret - cum_ret.cummax()).min()

    print(f"Sharpe: {sharpe:.2f}")
    print(f"Max Drawdown: {max_dd:.2%}")

if __name__ == '__main__':
    run()
`,

  // --- Scripts ---
  'scripts/download_csvs.py': `import yfinance as yf
import os

assets = ["SPY", "QQQ", "IWM"]
save_dir = "data/raw"
os.makedirs(save_dir, exist_ok=True)

for symbol in assets:
    print(f"Downloading {symbol}...")
    df = yf.download(symbol, start="2010-01-01", progress=False)
    df.to_csv(f"{save_dir}/{symbol}.csv")
    print(f"Saved {symbol}.csv")
`,

  'scripts/live_simulation.py': `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
import os
import yfinance as yf

# Assets
assets = ["SPY", "QQQ", "IWM"]
data_dir = "data/raw"
os.makedirs(data_dir, exist_ok=True)

dfs = {}
for asset in assets:
    path = f"{data_dir}/{asset}.csv"
    if not os.path.exists(path):
        print(f"Downloading {asset}...")
        df = yf.download(asset, period="1y", interval="1d", progress=False)
        df.to_csv(path)
    dfs[asset] = pd.read_csv(path, parse_dates=["Date"], index_col="Date")

returns = pd.DataFrame({a: dfs[a]["Adj Close"].pct_change() for a in assets}).dropna()

portfolio_returns = pd.Series(0, index=returns.index)
cumulative = pd.Series(1, index=returns.index)
drawdowns = pd.Series(0, index=returns.index)

plt.ion()
fig, ax = plt.subplots(figsize=(12,5))
line1, = ax.plot(cumulative, label="Cumulative Returns")
line2, = ax.plot(drawdowns, label="Drawdowns", color="red")
ax.set_title("Live Simulation Portfolio")
ax.legend()
plt.show()

window = 20
for i in range(window, len(returns)):
    # Simulation logic here...
    pass
`,

  'scripts/intraday_dashboard.py': `import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
import numpy as np

root = tk.Tk()
root.title("ORNG Intraday Live Dashboard")

tk.Label(root, text="ORNG Dashboard Active").pack()

root.mainloop()
`,

  'scripts/live_trading_prototype.py': `import pandas as pd
import yfinance as yf
from alpaca_trade_api.rest import REST

# Placeholder for live trading logic
print("Live trading prototype ready.")
`
};

// Execute creation
console.log(`Creating ORNG Lab structure in ${rootDir}...`);

if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir);
}

// Create folders
folders.forEach(folder => {
  const fullPath = path.join(rootDir, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${folder}`);
  }
});

// Create files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(rootDir, filePath);
  fs.writeFileSync(fullPath, content);
  console.log(`Created file: ${filePath}`);
});

console.log("ORNG Lab generation complete.");
