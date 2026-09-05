---
layout: home
title: Wickra Strategy-CI — pin your strategy, catch the regression
titleTemplate: false

hero:
  name: "Wickra Strategy-CI"
  text: "Jest for trading strategies."
  tagline: "Golden-pin your strategy's backtest report, catch regressions in CI, and property-test it against fuzzed market data — in ten languages, plus a reusable GitHub Action."
  image:
    src: /wickra-mark.svg
    alt: Wickra Strategy-CI
  actions:
    - theme: brand
      text: View on GitHub
      link: https://github.com/wickra-lib/wickra-strategy-ci
    - theme: alt
      text: The test format
      link: https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md
    - theme: alt
      text: API
      link: /api/rust

features:
  - icon: 📌
    title: Golden tests
    details: "Pin a strategy's BacktestReport and fail the build when it changes beyond a tolerance you set — absolute or relative, per field, exact by default."
  - icon: 🧪
    title: Property tests
    details: "Assert what must hold for any run, not just this one: no field NaN or infinite, drawdown inside a bound, the trade count above a floor, a named field in range."
  - icon: 🎲
    title: Fuzz tests
    details: "Perturb the input with a seeded PRNG and re-run. A strategy that only survives one exact price path fails here — and every perturbed candle is still a candle a market could print."
  - icon: 📄
    title: A test is a file, not a function
    details: "There is no test API to learn. A test is JSON: which strategy, over which dataset, pinned to which report, under which tolerances. Because it is data, it crosses every binding unchanged."
  - icon: 🎯
    title: Byte-identical across 10 languages
    details: "The runner lives once in the Rust core and every binding forwards its JSON verbatim, so the same test file produces the same bytes from Rust, Python, Node.js, WASM, C, C++, C#, Go, Java and R."
  - icon: ⚙️
    title: One line in your workflow
    details: "A composite GitHub Action installs the CLI and runs your test directory. A failing test fails the build — which is the whole point."
---

<script setup>
const installTabs = [
  { label: 'CLI',    lang: 'bash', code: 'cargo install wickra-strategy-ci' },
  { label: 'Python', lang: 'bash', code: 'pip install wickra-strategy-ci' },
  { label: 'Node',   lang: 'bash', code: 'npm install wickra-strategy-ci' },
  { label: 'Rust',   lang: 'bash', code: 'cargo add wickra-strategy-ci' },
  { label: 'WASM',   lang: 'bash', code: 'npm install wickra-strategy-ci-wasm' },
  { label: 'C',      lang: 'bash', code: '# prebuilt header + library from GitHub releases:\n# github.com/wickra-lib/wickra-strategy-ci/releases' },
  { label: 'C#',     lang: 'bash', code: 'dotnet add package Wickra.StrategyCi' },
  { label: 'Go',     lang: 'bash', code: 'go get github.com/wickra-lib/wickra-strategy-ci-go' },
  { label: 'Java',   lang: 'xml',  code: '<!-- Maven Central -->\n<dependency>\n  <groupId>org.wickra</groupId>\n  <artifactId>wickra-strategy-ci</artifactId>\n  <version>0.1.0</version>\n</dependency>' },
  { label: 'R',      lang: 'r',    code: 'install.packages("wickrastrategyci", repos = "https://wickra-lib.r-universe.dev")' },
]

const cliCode = `# Run a directory of strategy tests against a directory of OHLCV data.
# Exits non-zero the moment a report drifts, so CI fails on it.
wickra-strategy-ci run tests/ --data data/

# Re-pin the goldens after a change you meant to make.
wickra-strategy-ci bless tests/ --data data/

# List the test ids found under a path.
wickra-strategy-ci list tests/`

const actionCode = `name: strategy tests
on: [push, pull_request]

jobs:
  strategy-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: wickra-lib/wickra-strategy-ci@v0.1.0
        with:
          tests: tests/
          data: data/`

const pyCode = `import json
from wickra_strategy_ci import Session

session = Session()

# One JSON boundary, the same in every binding.
response = json.loads(session.command(json.dumps({
    "cmd": "run_suite",
    "tests": tests,      # a list of StrategyTest objects
    "data": {"BTCUSDT": candles},
})))

print(response["passed"], "passed,", response["failed"], "failed")
for result in response["results"]:
    for diff in result["diff"]:
        print(result["id"], diff["field"], diff["expected"], "->", diff["actual"])`

const snippetTabs = [
  { label: 'CLI',    lang: 'bash',       code: cliCode },
  { label: 'Action', lang: 'yaml',       code: actionCode },
  { label: 'Python', lang: 'python',     code: pyCode },
]
</script>

## A test is a file, not a function

There is no test API to learn. A test is JSON: which strategy, over which dataset,
pinned to which report, under which tolerances.

```json
{
  "id": "ema_crossover",
  "dataset_ref": "BTCUSDT",
  "strategy": {
    "symbol": "BTCUSDT",
    "timeframe": "1h",
    "indicators": {
      "fast": { "type": "Ema", "params": [12] },
      "slow": { "type": "Ema", "params": [26] }
    },
    "entry": { "cross_above": ["fast", "slow"] },
    "exit":  { "cross_below": ["fast", "slow"] },
    "sizing": { "type": "fixed_fraction", "fraction": 0.95 }
  },
  "expected": { "…": "the pinned BacktestReport, written by `bless`" },
  "tolerances": {
    "*": { "kind": "rel", "value": 0.0001 },
    "metrics.sharpe": { "kind": "abs", "value": 0.01 }
  },
  "property_checks": [
    { "kind": "no_nan" },
    { "kind": "max_drawdown_le", "value": 25.0 }
  ],
  "fuzz": { "seed": 42, "runs": 8, "perturbation": { "kind": "jitter", "amount": 0.001 } }
}
```

The `strategy` block is **opaque**: Strategy-CI never parses it, it forwards it
verbatim to the [`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest)
engine and pins whatever report comes back. So a spec that engine understands is a
spec this runner can pin, with no release here in between.

## Three axes, three questions

| Axis | The question it answers |
|------|-------------------------|
| **Golden** | Did the numbers change? Both reports are flattened to numeric leaves, rounded to eight decimals, and compared per field — reporting mismatches, fields that vanished, and fields that appeared. |
| **Property** | Is the run sane at all? Invariants that hold for *any* run, independent of a pinned value. |
| **Fuzz** | Does it survive a history it has not seen? Seeded perturbations, re-run, properties re-checked. The golden is not re-checked under fuzz — perturbed data produces a different report by design. |

## Install

The same runner from every language — native Rust, Python, Node.js and WASM, plus a C
ABI for C, C++, C#, Go, Java and R.

<InstallTabs :tabs="installTabs" />

## Pin it, then let CI hold the line

<InstallTabs :tabs="snippetTabs" />

Write the strategy, run `bless` once to pin the report, and commit the file. From then
on `run` fails the build whenever the numbers move further than you allowed.

## What a golden can and cannot catch

The diff works on **numeric leaves**. Both reports are flattened to a sorted map of
numbers — `metrics.sharpe`, `equity[3].equity` — and compared. Strings, booleans and
nulls are not pinned, so a report field that is text is outside what a golden can
catch. That is a real limit, and it is better stated than discovered.

## Built on the Wickra core

Wickra Strategy-CI is part of the [Wickra](https://wickra.org) ecosystem. It is the
test harness for the deterministic
[`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest) engine, whose
indicators are the same O(1) kernels that
[`wickra-core`](https://github.com/wickra-lib/wickra) computes live — so a pinned
report is pinned against exactly the numbers a live strategy would see.

> Wickra Strategy-CI is research and engineering tooling, not financial advice. A
> passing test attests only that a strategy's backtest report matches its pinned
> expectation under the given data — it makes no claim about the quality,
> profitability or future performance of any strategy. Trading carries risk; you are
> responsible for your own decisions.
