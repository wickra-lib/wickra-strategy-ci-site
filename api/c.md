# C and C++

The C ABI hub. Every non-native binding — C++, C#, Go, Java, R — reaches the core
through this library, so it is the one surface they all share.

Prebuilt headers and libraries ship with each
[GitHub release](https://github.com/wickra-lib/wickra-strategy-ci/releases) as
`wickra-strategy-ci-c-<triple>.tar.gz`.

## C

```c
#include "wickra_strategy_ci.h"

WickraStrategyCi *session = wickra_strategy_ci_new();

/* Two-call protocol: ask for the length, allocate, ask again. The response is
   deterministic, so the second call cannot return a different length. */
int32_t len = wickra_strategy_ci_command(session, cmd, NULL, 0);
char *out = malloc((size_t)len + 1);
wickra_strategy_ci_command(session, cmd, out, (uintptr_t)len + 1);

puts(out);
free(out);
wickra_strategy_ci_free(session);
```

A negative return means the call itself could not be made: `-1` for a null handle or
command, `-2` for a non-UTF-8 command, `-3` for a caught panic. An error *in the
request* comes back as a normal `{"ok":false,…}` response with a non-negative length.

## C++

A header-only RAII wrapper ships beside the C header. It owns the handle and hides the
two-call protocol:

```cpp
#include "wickra_strategy_ci.hpp"

wickra::strategy_ci::Session session;          // freed at scope exit
std::string response = session.command(cmd);   // one call, std::string out
```

`command` throws `wickra::strategy_ci::Error` for the negative codes above. It is
header-only and adds no runtime cost beyond the C calls themselves.

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

- [Binding README](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/bindings/c)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
