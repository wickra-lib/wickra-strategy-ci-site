# Python

Native PyO3 bindings over the Rust core, shipped as an abi3 wheel for CPython 3.9 and
newer. No system dependencies.

```bash
pip install wickra-strategy-ci
```

```python
import json
from wickra_strategy_ci import Session

session = Session()

response = json.loads(session.command(json.dumps({
    "cmd": "run_suite",
    "tests": tests,                 # a list of StrategyTest objects
    "data": {"BTCUSDT": candles},   # dataset_ref -> list of candles
})))

print(response["passed"], "passed,", response["failed"], "failed")
for result in response["results"]:
    for diff in result["diff"]:
        print(result["id"], diff["field"], diff["expected"], "->", diff["actual"])
```

`Session.version()` returns the core version. The session owns no state between
commands — tests and data travel with each call — so one session can serve a whole
run.

## The boundary

Every binding exposes the same two things: a `Session`, and one call that takes a
command envelope as JSON and returns the response as JSON. The commands are
`run_test`, `run_suite`, `bless`, `list` and `version`, and the response bytes are
identical in every language — that is what the
[golden corpus](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/golden)
pins.

Errors in the *request* — an unknown command, a malformed test — come back in-band as
`{"ok":false,"error":…}`, because they are data about the request rather than a
failure of the call.

## More

- [PyPI](https://pypi.org/project/wickra-strategy-ci/)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
