def cross_rank(df, window=20):
    momentum = df.pct_change(window)
    return momentum.rank(axis=1, ascending=False)
