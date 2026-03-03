import yaml
import yfinance as yf
import sys
import os

# Add root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from strategies.single_asset.ma_trend import apply_strategy
from risk.volatility_target.target import vol_target

def load_config(path='config/config.yaml'):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def run():
    try:
        cfg = load_config()
    except:
        # Fallback if config not found relative to execution
        cfg = load_config('../../config/config.yaml')

    asset = cfg['data']['assets'][0]
    print(f"Running pipeline for {asset}...")
    
    data = yf.download(asset, start=cfg['data']['start_date'], progress=False)
    
    if data.empty:
        print("No data downloaded.")
        return

    data = apply_strategy(data, cfg['strategy']['fast_window'], cfg['strategy']['slow_window'])
    data['position_size'] = vol_target(data['Close'].pct_change(), cfg['risk']['target_volatility'])
    data['risk_adj_returns'] = data['strategy_returns'] * data['position_size']
    
    sharpe = data['risk_adj_returns'].mean() / data['risk_adj_returns'].std() * (252 ** 0.5)
    
    cum_ret = (1 + data['risk_adj_returns']).cumprod()
    max_dd = (cum_ret - cum_ret.cummax()).min()

    print(f"Sharpe: {sharpe:.2f}")
    print(f"Max Drawdown: {max_dd:.2%}")

if __name__ == '__main__':
    run()
