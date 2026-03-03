def momentum(close, window=20):
    return close.pct_change(window)
