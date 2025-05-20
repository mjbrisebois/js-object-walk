[back to README.md](../README.md)

# API Reference

## `bindNative()`
Attempts to define `walk` on the native `Object` properties.  Returns the module exports so that
this can be called on the same line as `require`.

Example
```typescript
import { walk, DELETE, bindNative } from '@whi/object-walk';
bindNative();
```

## `walk( obj, replacer )`
Iterate over an object's properties and recursively iterate all child objects.  Calls replacer for
every key/value pair.

### Argument: `replacer( key, value, path )`
The `replacer` callback is given the parent's key and the current value.  `this` is set to the
parent object in-case you need access to it (ergo `this[key] == value`).

- If replacer returns the `DELETE` symbol the value will be deleted
- If replacer returns the same value (checked using `===`) it will do nothing

Example of collecting all object keys
```typescript
let keys = [];
Object.walk( input, function (key: string, value: any) {
    if ( typeof key === "string" )
        keys.push( key );
    return value;
});
```

Example of collecting all node paths
```typescript
let paths = [];
Object.walk( input, function (key: string, value: any, path: string[]) {
    paths.push( path.join('.') );
    return value;
});
```
