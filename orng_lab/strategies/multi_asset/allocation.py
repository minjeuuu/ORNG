def allocate_by_score(scores):
    positive = scores.clip(lower=0)
    weights = positive.div(positive.sum(axis=1), axis=0)
    return weights.fillna(0)
