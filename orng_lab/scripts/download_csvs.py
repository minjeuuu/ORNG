import yfinance as yf
import os

assets = ["SPY", "QQQ", "IWM"]
save_dir = "data/raw"
os.makedirs(save_dir, exist_ok=True)

for symbol in assets:
    print(f"Downloading {symbol}...")
    df = yf.download(symbol, start="2010-01-01", progress=False)
    df.to_csv(f"{save_dir}/{symbol}.csv")
    print(f"Saved {symbol}.csv")
