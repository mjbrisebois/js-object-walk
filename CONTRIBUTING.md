[back to README.md](README.md)

# Contributing

## Overview
This is a micro-package designed to be light-weight and traverse all an object's properties as
simply as possible.


## Development

See [docs/API.md](docs/API.md) for detailed API References

### `debug()`
Turns on debugging logs.

```javascript
const { walk, debug } = require('@whi/object-walk').bindNative();

debug(); // show debug logs
```

### Environment

- Developed using Node.js `v12.20.0`

### Building
No build required.  Vanilla JS only.

### Testing

To run all tests with logging
```
make test-debug
```

- `make test-unit-debug` - **Unit tests only**
- `make test-integration-debug` - **Integration tests only**

> **NOTE:** remove `-debug` to run tests without logging
