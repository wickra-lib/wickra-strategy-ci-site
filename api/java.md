# Java

A binding over the C ABI using the Foreign Function & Memory API (Panama), so there is
no JNI shim to build. Targets Java 22 and newer.

```xml
<dependency>
  <groupId>org.wickra</groupId>
  <artifactId>wickra-strategy-ci</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
import org.wickra.strategyci.Session;

try (Session session = new Session()) {
    String response = session.command(commandJson);
    System.out.println(Session.version());
    System.out.println(response);
}
```

`Session` is `AutoCloseable` and owns the native handle, so it belongs in a
try-with-resources. The native library for the running platform is unpacked from the
JAR at first use.

FFM needs native access enabled at run time: `--enable-native-access=ALL-UNNAMED`.

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

- [Maven Central](https://central.sonatype.com/artifact/org.wickra/wickra-strategy-ci)
- [Source & examples](https://github.com/wickra-lib/wickra-strategy-ci/tree/main/examples)
- [The test format](https://github.com/wickra-lib/wickra-strategy-ci/blob/main/docs/TESTS.md)
