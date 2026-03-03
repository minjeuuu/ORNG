import pandas as pd

def ensemble(signals):
    df = pd.concat(signals, axis=1)
    return (df.mean(axis=1) > 0.5).astype(int)
