```js
import CacheFactory from 'cachefactory';

const cacheFactory = new CacheFactory();

// This cache will sync itself with localStorage if it exists, otherwise it
// won't. Every time the browser loads this app, this cache will attempt to
// initialize itself with any data it had already saved to localStorage (or
// sessionStorage if you used that).
const cache = cacheFactory.createCache('my-cache', {
  // Items added to this cache expire after 15 minutes
  maxAge: 15 * 60 * 1000,

  // This cache will clear itself every hour
  cacheFlushInterval: 60 * 60 * 1000,

  // Items will be deleted from this cache right when they expire
  deleteOnExpire: 'aggressive',

  // This cache will use `localStorage`
  storageMode: 'localStorage'
});
```

## Using cachefactory in browsers that DON'T support localStorage:

### Option 1

Do nothing (the cache will just store data in memory)

### Option 2

Create/use a polyfill that provides the global `localStorage` and
`sessionStorage` objects. CacheFactory will attempt to use these if it finds
them.

### Option 3

Tell CacheFactory exactly which polyfill to use (also useful if you just want to
use your own implementation/wrapper for localStorage):

```js
const localStoragePolyfill = {
  getItem: function (key) { ... },
  setItem: function (key, value) { ... },
  removeItem: function (key) { ... }
};

// Always use the polyfill
const cache = cacheFactory.createCache('my-cache', {
  // Items added to this cache expire after 15 minutes
  maxAge: 15 * 60 * 1000,

  // This cache will clear itself every hour
  cacheFlushInterval: 60 * 60 * 1000,

  // Items will be deleted from this cache right when they expire
  deleteOnExpire: 'aggressive',

  // This cache will use `localStorage`
  storageMode: 'localStorage',

  // CacheFactory will use this polyfill instead of looking for localStorage
  storageImpl: localStoragePolyfill
});

// Conditionally use the polyfill
const options = {
  // Items added to this cache expire after 15 minutes
  maxAge: 15 * 60 * 1000,

  // This cache will clear itself every hour
  cacheFlushInterval: 60 * 60 * 1000,

  // Items will be deleted from this cache right when they expire
  deleteOnExpire: 'aggressive',

  // This cache will use `localStorage`
  storageMode: 'localStorage'
};
if (!window.localStorage) {
  options.storageImpl = localStoragePolyfill;
}
const cache = cacheFactory.createCache('my-cache', options);
```

Documentation on the interface that must be implemented by any storageImpl
polyfill used by cachefactory can be found on the W3C Recommendation page for
webstorage. The interface itself looks like:

```
interface Storage {
  readonly attribute unsigned long length;
  DOMString? key(unsigned long index);
  getter DOMString getItem(DOMString key);
  setter creator void setItem(DOMString key, DOMString value);
  deleter void removeItem(DOMString key);
  void clear();
};
```

CacheFactory cares only about these three methods:

- `setItem`
- `getItem`
- `removeItem`

One developer suggested using [store.js](https://github.com/marcuswestin/store.js)
—a wrapper and polyfill for localStorage. However, store.js has its own API that
doesn't match that of the webstorage spec, so if you want to use store.js or any
other 3rd-party polyfill then you'll need to create a wrapper for it if it
doesn't have the same API as localStorage.

For example:

```js
const storeJsToStandard = {
  getItem: store.get,
  setItem: store.set,
  removeItem: store.remove
};

cacheFactory.createCache('my-cache', {
  storageMode: 'localStorage',
  storageImpl: storeJsToStandard
});
```
