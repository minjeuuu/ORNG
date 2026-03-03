def trend_strength(close, window=20):
    return close.diff(window)
