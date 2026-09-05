# Rust

The native crate, and the only binding with a typed API rather than the JSON
boundary. `run_suite` runs a whole corpus, `run_test` runs one, `bless` re-pins a
golden.

```bash
cargo add wickra-strategy-ci
```

```rust
use std::collections::BTreeMap;
use strategy_ci_core::{bless, run_suite, run_test, Candle, StrategyTest};

// A StrategyTest is serde data: the strategy sub-JSON is opaque and forwarded
// to the wickra-backtest engine untouched.
let tests: Vec<StrategyTest> = serde_json::from_str(&std::fs::read_to_string("tests.json")?)?;
let data: BTreeMap<String, Vec<Candle>> = load_candles()?;

let suite = run_suite(&tests, &data)?;
println!("{} passed, {} failed", suite.passed, suite.failed);

for result in &suite.results {
    for diff in &result.diff {
        println!("{}: {} {:?} -> {:?}", result.id, diff.field, diff.expected, diff.actual);
    }
}

// Re-pin one test after an intended change.
let repinned = bless(&tests[0], &data)?;
```

`run_suite` runs the tests concurrently under the `parallel` feature (on by default)
and sequentially without it. The results are sorted by id either way, so the two paths
produce the same bytes — every binding checks that.

## Features

| Feature | Default | What it does |
|---------|---------|--------------|
| `parallel` | on | Runs a suite's tests concurrently with rayon. |
| `proof` | off | Adds a deterministic BLAKE3 `report_hash` to each `TestResult`, from the [wickra-proof](https://github.com/wickra-lib/wickra-proof) core. |

## More

- [crates.io/crates/wickra-strategy-ci](https://crates.io/crates/wickra-strategy-ci) · [docs.rs](https://docs.rs/wickra-strategy-ci)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
