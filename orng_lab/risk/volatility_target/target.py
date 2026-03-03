def vol_target(returns, target=0.01, window=20):
    vol = returns.rolling(window).std()
    size = target / vol
    return size.clip(0, 1)
