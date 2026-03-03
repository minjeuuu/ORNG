def cap_leverage(weights, max_lev):
    return weights.clip(-max_lev, max_lev)
