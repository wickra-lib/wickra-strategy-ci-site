# R

A `.Call` binding over the C ABI, built from source against a C ABI library the package
downloads at install time.

```r
install.packages("wickrastrategyci", repos = "https://wickra-lib.r-universe.dev")
```

```r
library(wickrastrategyci)

session <- wkstrategyci_new()

response <- wkstrategyci_command(session, cmd_json)
cat(wkstrategyci_version(), "\n")
cat(response, "\n")
```

The handle is an external pointer with a finalizer, so R releases it when the object is
collected — there is nothing to close by hand.

`configure` downloads the `wickra-strategy-ci-c-<triple>.tar.gz` release asset matching
the package's version and bundles the library beside the compiled object. To build
against a locally built C ABI instead, set `WKSTRATEGYCI_INC` and `WKSTRATEGYCI_LIB`.

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

- [r-universe](https://wickra-lib.r-universe.dev)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
