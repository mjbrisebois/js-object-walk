[![](https://img.shields.io/npm/v/@whi/object-walk/latest?style=flat-square)](http://npmjs.com/package/@whi/object-walk)

# `Object.walk( obj, replacer )`
This module is intended to help with recursively traversing an object and optionally replacing
values.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/js-object-walk?style=flat-square)](https://github.com/mjbrisebois/js-object-walk/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/js-object-walk?style=flat-square)](https://github.com/mjbrisebois/js-object-walk/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/js-object-walk?style=flat-square)](https://github.com/mjbrisebois/js-object-walk/pulls)


## Overview


### Doesn't [`traverse`](https://www.npmjs.com/package/traverse) do this?

Traverse is a great library, but it hasn't been updated since 2013.  The internal assumptions
(specifically around the immutable/copy feature) do not support newer types such as Node's `Buffer`
class.  You may see this error message when using `traverse` with `Buffer`

```
TypeError: Method get TypedArray.prototype.length called on incompatible receiver [object Object]
```

Another reason you might use `Object.walk` instead of `traverse` is to avoid dependence on `this`
context.  I don't see anything wrong with the object oriented approach, but this library is intended
to feel like a native method.  Other native implementations with callbacks (such as
`JSON.stringify`) don't add contextual API's to `this`.


## Install

```bash
npm i @whi/object-walk
```

## Usage

```typescript
import { walk } from '@whi/object-walk';

walk( some_obj, function ( key, value ) {
    return value;
});
```

Alternatively, attach `walk` to the native `Object` as a method.

```typescript
import { bindNative } from '@whi/object-walk';
bindNative();

Object.walk( some_obj, function ( key, value ) {
    return value;
});
```

### API Reference

See [docs/API.md](docs/API.md)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
