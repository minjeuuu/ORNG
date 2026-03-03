def volatility_regime(returns, window=20):
    vol = returns.rolling(window).std()
    threshold = vol.median()
    return (vol > threshold).astype(int)
