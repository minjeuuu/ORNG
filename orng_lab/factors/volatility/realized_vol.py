def realized_vol(returns, window=20):
    return returns.rolling(window).std() * (252 ** 0.5)
