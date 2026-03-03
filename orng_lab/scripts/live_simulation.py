import pandas as pd
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
