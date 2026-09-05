# WebAssembly

A `wasm-bindgen` build of the same core, for the browser or Node. It is compiled
`--no-default-features`, so its suite runs **sequentially** where the native bindings
parallelise — and produces the same bytes, which is the point.

```bash
npm install wickra-strategy-ci-wasm
```

```js
import init, { Session, version } from "wickra-strategy-ci-wasm";

await init();

const session = new Session();
const response = JSON.parse(
  session.command(JSON.stringify({ cmd: "run_suite", tests, data })),
);

console.log(version(), response.passed, "passed");
```

For Node, build with `--target nodejs` and `require()` the package instead; no `init()`
is needed there.

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

- [npm](https://www.npmjs.com/package/wickra-strategy-ci-wasm)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
