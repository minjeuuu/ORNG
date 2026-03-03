def inject_noise(price, sigma):
    return price + np.random.normal(0, sigma, len(price))
