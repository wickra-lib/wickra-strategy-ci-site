# About Wickra Strategy-CI

Wickra Strategy-CI is a test runner for trading strategies, built on the Wickra core.
A test is **data — a JSON file, not code** — naming a strategy, the data to run it
over, and the report it is pinned to. When the numbers move further than you allowed,
the build fails.

## What makes it different

- **A test is a file, not a function.** There is no test API to learn and no framework
  to subclass. Because a test is data, the same file produces the same result from
  every binding, and a suite is a directory you can diff and review.
- **The strategy stays opaque.** Strategy-CI never parses the `strategy` block — it
  forwards it verbatim to the [`wickra-backtest`](https://github.com/wickra-lib/wickra-backtest)
  engine and pins whatever report comes back. So a spec that engine understands is one
  this runner can pin, with no release here in between.
- **Three axes, three questions.** A golden asks *did the numbers change*. A property
  asks *is the run sane at all*. A fuzz run asks *does it survive a history it has not
  seen*. They fail for different reasons, which is what makes a failure informative.
- **Byte-identical across ten languages.** The runner lives once in Rust and every
  binding forwards its JSON verbatim, pinned by a shared golden corpus. Each binding
  also checks that the parallel suite path agrees with running the tests one at a time.

## Why it exists

A backtest is only worth something if it is reproducible. Wickra's engine is
deterministic, so a strategy's report is a stable artefact — the same input gives the
same numbers, every time. That makes it pinnable, the way a snapshot test pins
rendered output.

Without that pin, a strategy drifts quietly: a dependency bump, an engine change, an
edited parameter, and the numbers move without anyone noticing until the difference
shows up somewhere expensive. Strategy-CI turns the report into something CI can hold
the line on.

## What a golden cannot do

The diff works on **numeric leaves**. Both reports are flattened to a sorted map of
numbers, rounded to eight decimals, and compared field by field. Strings, booleans and
nulls are not pinned — so a report field that is text is outside what a golden can
catch.

A passing test also says nothing about whether a strategy is any *good*. It says the
numbers did not move. Those are different claims, and conflating them is how a green
suite becomes misleading.

## Open source

Released under the **MIT OR Apache-2.0** license — permissive, OSI-approved, free for
any use including commercial. Source, issues and releases on
[GitHub](https://github.com/wickra-lib/wickra-strategy-ci).

## Disclaimer

Wickra Strategy-CI is research and engineering tooling, **not** a trading system, and
is provided **as-is with no warranty**. A passing test attests only that a strategy's
backtest report matches its pinned expectation under the given data; it is not
financial advice and does not predict future returns. Trading carries risk, and you are
responsible for your own decisions.
