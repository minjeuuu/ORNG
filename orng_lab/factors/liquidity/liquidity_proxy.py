def amihud_illiquidity(returns, volume):
    return returns.abs() / volume
