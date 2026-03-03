def low_vol_anomaly(returns, window):
    return 1 / returns.rolling(window).std()
