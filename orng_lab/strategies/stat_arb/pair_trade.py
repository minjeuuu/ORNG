import numpy as np

def pair_signal(z):
    signal = np.zeros(len(z))
    signal[z > 2] = -1
    signal[z < -2] = 1
    return signal
