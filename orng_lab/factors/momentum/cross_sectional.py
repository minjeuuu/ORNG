def cross_sectional_momentum(returns, window):
    return returns.rolling(window).mean().rank(axis=1)
