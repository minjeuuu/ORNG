def macro_surprise(actual, consensus):
    return (actual - consensus) / consensus.std()
