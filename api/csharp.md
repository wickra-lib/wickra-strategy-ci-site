# C#

A thin P/Invoke layer over the C ABI, shipped on NuGet with the native library for
`win-x64`, `win-arm64`, `linux-x64`, `linux-arm64`, `osx-x64` and `osx-arm64`.

```bash
dotnet add package Wickra.StrategyCi
```

```csharp
using System.Text.Json;
using Wickra.StrategyCi;

using var session = new Session();

string response = session.Command(JsonSerializer.Serialize(new
{
    cmd = "run_suite",
    tests,                              // StrategyTest objects
    data = new { BTCUSDT = candles },   // dataset_ref -> candles
}));

var suite = JsonSerializer.Deserialize<JsonElement>(response);
Console.WriteLine($"{suite.GetProperty("passed")} passed");
```

`Session` is `IDisposable` and owns the native handle; `Session.Version()` is static.
The correct native library is resolved per platform from the NuGet payload, and in a
dev checkout the resolver also probes the Cargo `target` tree.

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

- [NuGet](https://www.nuget.org/packages/Wickra.StrategyCi)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
