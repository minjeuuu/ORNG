def walk_forward_split(data, splits=5):
    size = len(data)
    step = size // splits
    windows = []
    for i in range(splits - 1):
        train = data.iloc[: step * (i + 1)]
        test = data.iloc[step * (i + 1): step * (i + 2)]
        windows.append((train, test))
    return windows
