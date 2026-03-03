import pandas as pd

def apply_strategy(data, fast=20, slow=100):
    data["ma_fast"] = data["Close"].rolling(fast).mean()
    data["ma_slow"] = data["Close"].rolling(slow).mean()
    data["signal"] = (data["ma_fast"] > data["ma_slow"]).astype(int)
    data["returns"] = data["Close"].pct_change()
    data["strategy_returns"] = data["signal"].shift(1) * data["returns"]
    return data.dropna()
