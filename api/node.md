# Node.js

Native napi-rs bindings, published with prebuilt binaries for Linux, macOS and Windows
on x64 and arm64. Nothing compiles at install time.

```bash
npm install wickra-strategy-ci
```

```js
const { Session } = require("wickra-strategy-ci");

const session = new Session();

const response = JSON.parse(
  session.command(JSON.stringify({
    cmd: "run_suite",
    tests,                          // an array of StrategyTest objects
    data: { BTCUSDT: candles },     // dataset_ref -> array of candles
  })),
);

console.log(`${response.passed} passed, ${response.failed} failed`);
for (const result of response.results) {
  for (const diff of result.diff) {
    console.log(result.id, diff.field, diff.expected, "->", diff.actual);
  }
}
```

The native binary arrives through `optionalDependencies` — one package per platform,
so `npm install` fetches only the one it needs.

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

- [npm](https://www.npmjs.com/package/wickra-strategy-ci)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
