def split_data(data, train_pct=0.7):
    split_idx = int(len(data) * train_pct)
    return data[:split_idx], data[split_idx:]
