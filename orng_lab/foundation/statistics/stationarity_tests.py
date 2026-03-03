from statsmodels.tsa.stattools import adfuller
def check_stationarity(series):
    result = adfuller(series)
    return result[1] < 0.05
