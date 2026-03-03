def threshold_filter(signal, threshold):
    return signal if abs(signal) > threshold else 0
