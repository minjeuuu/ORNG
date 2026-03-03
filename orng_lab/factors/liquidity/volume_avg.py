def avg_volume(volume, window=20):
    return volume.rolling(window).mean()
