import numpy as np

def bootstrap_returns(returns, runs=500):
    results = []
    for _ in range(runs):
        sampled = np.random.choice(returns, size=len(returns), replace=True)
        results.append(sampled.mean() / sampled.std())
    return np.array(results)
