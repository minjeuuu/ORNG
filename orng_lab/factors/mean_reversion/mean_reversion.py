def mean_reversion_strength(price, window):
    return -1 * (price - price.rolling(window).mean())
