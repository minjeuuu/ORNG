# ORNG Quant Research Lab

ORNG is a zero-capital quantitative research system.

## Structure
- foundation/: math, statistics, and market theory
- data/: raw, cleaned, and adjusted datasets
- factors/: factor definitions and formulas
- strategies/: baseline, multi-asset, ensembles, and stat arb
- risk/: risk management modules
- validation/: walk forward, Monte Carlo, regimes
- automation/: pipelines and scheduled runs
- archive/: daily logs, failed strategies, postmortems
- intelligence/: AI prompts, critiques, diagnostics
- publication/: tear sheets, papers, summaries
- docs/: execution plans, checklists, and interview scripts

## Documentation
- [90 Day Execution Plan](docs/90_day_plan.md)
- [Daily Operating Loop](docs/daily_operating_loop.md)
- [Interview Script](docs/interview_script.md)
- [Final Polish Checklist](docs/final_polish_checklist.md)

## Setup
```bash
python -m venv quant_env
source quant_env/bin/activate
pip install -r requirements.txt
```

## Running the Pipeline
```bash
python automation/pipelines/run_pipeline.py
```
