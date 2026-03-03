def vol_expansion(price, window):
    return price.rolling(window).std().diff()
