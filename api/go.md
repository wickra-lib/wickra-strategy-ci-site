# Go

cgo bindings over the C ABI. The standalone module vendors the header and ships the
prebuilt library per platform, so `go get` is all it takes.

```bash
go get github.com/wickra-lib/wickra-strategy-ci-go
```

```go
package main

import (
    "encoding/json"
    "fmt"

    wickra "github.com/wickra-lib/wickra-strategy-ci-go"
)

func main() {
    session := wickra.New()
    defer session.Close()

    cmd, _ := json.Marshal(map[string]any{
        "cmd": "run_suite", "tests": tests, "data": data,
    })

    response, err := session.Command(string(cmd))
    if err != nil {
        panic(err)
    }
    fmt.Println(wickra.Version(), response)
}
```

`Close` releases the native handle; the caller owns it, so a `defer` belongs next to
every `New`.

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

- [pkg.go.dev](https://pkg.go.dev/github.com/wickra-lib/wickra-strategy-ci-go)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
