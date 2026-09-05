---
title: Benchmarks
description: How a Wickra Strategy-CI suite scales with test count and dataset size — criterion measurements, reproducible on your own hardware.
---

# Benchmarks

The question a test runner has to answer is not "how fast is one operation" but
**"can I afford to run this on every pull request?"** So what is measured here is a
whole suite: `run_suite` across the cross-product of test counts and dataset sizes.

Reproduce any of it:

```bash
cargo bench -p strategy-ci-bench
```

## run_suite, parallel path

Median wall-clock for a full suite, and the per-test cost derived from it.

| Dataset | Tests | Suite | Per test |
|---------|-------|-------|----------|
| small (200 bars)  | 10   | 2.1 ms  | ~206 µs  |
| small (200 bars)  | 100  | 13.4 ms | ~134 µs  |
| small (200 bars)  | 1000 | 143 ms  | ~143 µs  |
| large (2000 bars) | 10   | 21.2 ms | ~2.12 ms |
| large (2000 bars) | 100  | 156 ms  | ~1.56 ms |
| large (2000 bars) | 1000 | 1.24 s  | ~1.24 ms |

## Reading the shape, not the milliseconds

Two things in that table matter more than any single figure:

**Per-test cost scales with bars, not with tests.** Ten times the bars is roughly ten
times the per-test time (134 µs → 1.56 ms). Ten times the *tests* is roughly flat once
the rayon pool is saturated. So a suite is priced by how much history each test
replays, not by how many tests you have — adding the hundredth test costs about what
the tenth did.

**The runner is not the cost.** Per-test time is dominated by the
[`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest) engine walking the
price history. Strategy-CI's own work — flattening two reports, diffing them field by
field, evaluating properties — is `O(fields)` and a small fraction on top.

**The fuzz axis multiplies.** A test with `"runs": 8` costs about eight times a test
without one, because each run re-backtests a perturbed dataset. That is the axis to
watch on a hot CI path; 8–16 runs is usually enough to shake out a knife-edge signal.

## What this means for a pull request

A realistic suite — a few dozen strategies over a couple of thousand bars each —
finishes in well under a second. That is cheap enough to gate every push, which is the
only threshold that actually matters: a check people skip because it is slow is a check
that does not exist.

## Caveats worth stating

These are medians from a developer workstation. The authoritative figures are the
nightly `bench.yml` run on the CI reference runner, and every pull request is measured
by [CodSpeed](https://codspeed.io), which counts **instructions under
instrumentation** rather than wall-clock — a number that does not move because a
neighbouring VM got busy.

Absolute milliseconds will drift with the engine, the toolchain and the machine. Treat
the *relative scaling* as the contract, not the numbers.

Full method, the bench definitions and the parallel-versus-sequential comparison live
in
[BENCHMARKS.md](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/BENCHMARKS.md).
