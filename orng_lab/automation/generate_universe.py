import os
import itertools
import yaml

# Define parameter ranges for combinatorial generation
factors = ['momentum', 'mean_reversion', 'volatility', 'trend', 'liquidity']
windows = [5, 10, 20, 50, 100, 200]
vol_targets = [0.05, 0.10, 0.15, 0.20]
universes = ['SPY', 'QQQ', 'IWM', 'GLD', 'TLT']

# Output directory
output_dir = "orng_lab/automation/generated_strategies"
os.makedirs(output_dir, exist_ok=True)

print(f"Generating strategy universe in {output_dir}...")

count = 0
# Generate permutations
for factor in factors:
    for window in windows:
        for vol in vol_targets:
            for asset in universes:
                # Create a unique strategy config
                strategy_id = f"{factor}_{window}d_{int(vol*100)}vol_{asset}"
                
                config = {
                    "id": strategy_id,
                    "asset": asset,
                    "factor": factor,
                    "params": {
                        "window": window,
                        "vol_target": vol
                    },
                    "validation": {
                        "train_split": 0.7,
                        "metric": "sharpe"
                    },
                    "execution": {
                        "mode": "paper",
                        "broker": "alpaca"
                    }
                }
                
                # Write to YAML file
                filename = f"{output_dir}/{strategy_id}.yaml"
                with open(filename, 'w') as f:
                    yaml.dump(config, f)
                
                count += 1

print(f"Successfully generated {count} strategy configuration files.")
print("The ORNG system can now iterate through these configurations to find robust edges.")
