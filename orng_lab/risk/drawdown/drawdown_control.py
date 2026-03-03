def drawdown_stop(current_dd, limit):
    if current_dd < limit:
        return 0 # Close position
    return 1
