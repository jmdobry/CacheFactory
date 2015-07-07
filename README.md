## cachefactory [![bower version](https://img.shields.io/bower/v/cachefactory.svg?style=flat-square)](https://www.npmjs.org/package/cachefactory) [![npm version](https://img.shields.io/npm/v/cachefactory.svg?style=flat-square)](https://www.npmjs.org/package/cachefactory) [![Circle CI](https://img.shields.io/circleci/project/jmdobry/cachefactory/master.svg?style=flat-square)](https://circleci.com/gh/jmdobry/cachefactory/tree/master) [![npm downloads](https://img.shields.io/npm/dm/cachefactory.svg?style=flat-square)](https://www.npmjs.org/package/cachefactory) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/jmdobry/cachefactory/blob/master/LICENSE)

CacheFactory is a very simple and useful cache.

__Latest Release:__ [![Latest Release](https://img.shields.io/github/release/jmdobry/cachefactory.svg?style=flat-square)](https://github.com/jmdobry/cachefactory/releases)

__Status:__

[![Dependency Status](https://img.shields.io/gemnasium/jmdobry/cachefactory.svg?style=flat-square)](https://gemnasium.com/jmdobry/cachefactory) [![Coverage Status](https://img.shields.io/coveralls/jmdobry/cachefactory/master.svg?style=flat-square)](https://coveralls.io/r/jmdobry/cachefactory?branch=master) [![Codacity](https://img.shields.io/codacy/5e27e21d0c4c4d4cb203d589384aa93a.svg?style=flat-square)](https://www.codacy.com/public/jasondobry/cachefactory/dashboard)

__Supported Browsers:__

[![browsers](https://img.shields.io/badge/Browser-Chrome%2CFirefox%2CSafari%2COpera%2CIE%209%2B%2CiOS%20Safari%207.1%2B%2CAndroid%20Browser%202.3%2B-green.svg?style=flat-square)](https://github.com/jmdobry/cachefactory)

### Table of Contents
- [Quick Start](#quick-start)
- [The Basics](#the-basics)
- [Working with a cache](#working-with-a-cache)
- [Configuration Options](#configuration-options)
- [Using CacheFactory with localStorage](#using-cachefactory-with-localstorage)
- [API Reference](#api-reference)

### Quick Start
`bower install --save cachefactory` or `npm install --save cachefactory`.

```js
if (!CacheFactory.get('bookCache')) {
  // or CacheFactory('bookCache', { ... });
  CacheFactory.createCache('bookCache', {
    deleteOnExpire: 'aggressive',
    recycleFreq: 60000
  });
}

var bookCache = CacheFactory.get('bookCache');

bookCache.put('bookOne', { title: 'BookOne', id: 1 });
```

### The Basics

Grab `CacheFactory` then create a cache. Let's go:

```js
var profileCache;

// Check to make sure the cache doesn't already exist
if (!CacheFactory.get('profileCache')) {
  profileCache = CacheFactory('profileCache');
}
```

Let's add some items to the cache:

```js
profileCache.put('/profiles/34', {
  name: 'John',
  skills: ['programming', 'piano']
});

profileCache.put('/profiles/22', {
  name: 'Sally',
  skills: ['marketing', 'climbing', 'painting']
});
```

Right now, these items will stay in the cache until a page refresh.

Let's have items which are added to `profileCache` expire after an hour:

```js
profileCache = CacheFactory('profileCache', {
  maxAge: 60 * 60 * 1000 // 1 hour
});
```

Perfect. Say we also want the items removed from the cache when they expire:

```js
profileCache = CacheFactory('profileCache', {
  maxAge: 60 * 60 * 1000 // 1 hour,
  deleteOnExpire: 'aggressive'
});
```

Let's say that when the items do expire, we want to refresh them with new values:

```js
profileCache = CacheFactory('profileCache', {
  maxAge: 60 * 60 * 1000 // 1 hour,
  deleteOnExpire: 'aggressive',
  onExpire: function (key, value) {
    myAjaxLib.get(key).success(function (data) {
      profileCache.put(key, data);
    });
  }
});
```

Or say we want all of our caches to use that configuration as their default:

```js
myUtils.extend(CacheFactory.defaults, {
  maxAge: 3600000,
  deleteOnExpire: 'aggressive',
  onExpire: function (key, value) {
    var _this = this; // "this" is the cache in which the item expired
    myAjaxLib.get(key).success(function (data) {
      _this.put(key, data);
    });
  }
});
```

### Working with a cache

We can retrieve items from a cache like so:

```js
var profile = profileCache.get('/profiles/34');

profile.name; // 'John'
```

And get information about items in the cache:

```js
var info = profileCache.info('/profiles/34');

info.isExpired; // false
// etc.
```

and information about the cache itself:

```
var info = profileCache.info();

info.size; // 2
info.maxAge; // 3600000
info.deleteOnExpire; // 'aggressive'
// etc.
```

Items are easily removed, and we can destroy our cache when we're done with it:

```js
profileCache.remove('/profiles/34');

profileCache.get('/profiles/34'); // undefined

profileCache.destroy();

CacheFactory.get('profileCache'); // undefined
```

### Configuration Options

These options apply to:

- `CacheFactory(cacheId[, options)`
- `CacheFactory.createCache(cacheId[, options])`
- `Cache#setOptions(options[, strict])`
- `Cache#setMaxAge(maxAge)`, `Cache#setOnExpire(onExpire)`, etc.

##### `cacheFlushInterval`

If set, remove all items from a cache on an interval after the given number of milliseconds. Default: `null`.

##### `capacity`

Maximum number of items a cache can hold. Adding more items than the capacity will cause the cache to operate like an LRU cache, removing the least recently used items to stay under capacity. Default: `Number.MAX_VALUE`.

##### `deleteOnExpire`

Determines the behavior of a cache when an item expires. Default: `none`.

Possible values:

- `none` - Cache will do nothing when an item expires.
- `passive` - Cache will do nothing when an item expires. Expired items will remain in the cache until requested, at which point they are removed, and `undefined` is returned.
- `aggressive` - Cache will remove expired items as soon as they are discovered.

##### `disabled`

Determines whether a cache is disabled. Default: `false`.

##### `onExpire`

A callback function to be executed whenever an expired item is removed from a cache when the cache is in `passive` or `aggressive` mode. Will be passed the `key` and `value` of the expired item.

Will be passed a third `done` argument if the cache is in `passive` mode. This allows you to synchronously access the `key` and `value` of the expired item when you make the `Cache#get(key[, options])` call that is the reason the expired item is being removed in the first place. Default: `null`.

##### `maxAge`

The number of milliseconds until a newly inserted item expires. Default: `Number.MAX_VALUE`.

##### `recycleFreq`

Determines how often a cache will scan for expired items when in `aggressive` mode. Default: `1000` (milliseconds).

##### `storageImpl`

Provide a custom storage medium, e.g. a polyfill for `localStorage`. Default: `null`.

Must implement:

- `setItem` - Same API as `localStorage.setItem(key, value)`
- `getItem` - Same API as `localStorage.getItem(key)`
- `removeItem` - Same API as `localStorage.removeItem(key)`

##### `storageMode`

Determines the storage medium used by a cache. Default: `memory`.

Possible values:

- `memory` - Cache will hold data in memory. Data is cleared when the page is refreshed.
- `localStorage` - Cache will hold data in `localStorage` if available. Data is _not_ cleared when the page is refreshed.
- `sessionStorage` - Cache will hold data in `sessionStorage` if available. Data is _not_ cleared when the page is refreshed.

##### `storagePrefix`

Determines the namespace of a cache when `storageMode` is set to `localStorage` or `sessionStorage`. Make it a shorter string to save space. Default: `cachefactory.caches.`.

##### `storeOnReject`

If inserting a promise into a cache, also insert the rejection value if the promise rejects. Default: `false`.

##### storeOnResolve

If inserting a promise into a cache, also insert the resolved value if the promise resolves. Default: `false`.

### Using cachefactory with localStorage

```js
// This cache will sync itself with localStorage if it exists, otherwise it won't. Every time the
// browser loads this app, this cache will attempt to initialize itself with any data it had
// already saved to localStorage (or sessionStorage if you used that).
var myAwesomeCache = CacheFactory('myAwesomeCache', {
  maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
  cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
  deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
  storageMode: 'localStorage' // This cache will use `localStorage`.
});
```

Using cachefactory in browsers that DON'T support localStorage:

Option 1 - Do nothing (the cache will just store data in memory)

Option 2 - Create/use a polyfill that provides the global `localStorage` and `sessionStorage` objects. cachefactory will attempt to use these if it finds them.

Option 3 - Tell cachefactory exactly which polyfill to use (also useful if you just want to use your own implementation/wrapper for localStorage):

```js
var localStoragePolyfill = {
  getItem: function (key) { ... },
  setItem: function (key, value) { ... },
  removeItem: function (key) { ... }
};

// Always use the polyfill
var myAwesomeCache = CacheFactory('myAwesomeCache', {
  maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
  cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
  deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
  storageMode: 'localStorage', // This cache will use `localStorage`.
  storageImpl: localStoragePolyfill // cachefactory will use this polyfill instead of looking for localStorage
});

// Conditionally use the polyfill
var options = {
  maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
  cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
  deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
  storageMode: 'localStorage' // This cache will use `localStorage`.
};
if (!window.localStorage) {
  options.storageImpl = localStoragePolyfill;
}
var myAwesomeCache = CacheFactory('myAwesomeCache', options);
```

Documentation on the interface that must be implemented by any storageImpl polyfill used by cachefactory can be found on the W3C Recommendation page for webstorage. The interface itself looks like:

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

cachefactory cares only about these three methods:

- `setItem`
- `getItem`
- `removeItem`

One developer suggested using store.js–a wrapper and polyfill for localStorage. However, store.js has its own API that doesn't match that of the webstorage spec, so if you want to use store.js or any other 3rd-party polyfill then you'll need to create a wrapper for it if it doesn't have the same API as localStorage . For example:

```js
var storeJsToStandard {
  getItem: store.get,
  setItem: store.set,
  removeItem: store.remove
};

CacheFactory('myNewCache', {
  storageMode: 'localStorage',
  storageImpl: storeJsToStandard
});
```

### API Reference

##### `CacheFactory(cacheId[, options])` & `CacheFactory.createCache(cacheId[, options])`

Create a cache. Cache must not already exist. `cacheId` must be a string. `options` is an optional argument and must be an object. Any options you pass here will override any default options.

```js
var cache = CacheFactory('cache');
var cache2 = CacheFactory.createCache('cache2');
var cache3 = CacheFactory('cache', { maxAge: 900000 });
var cache4 = CacheFactory('cache'); // Error "cache already exists!"
```

##### `CacheFactory.get(cacheId)`

Return the cache with the given `cacheId`.

##### `CacheFactory.info()`

Return an object of key-value pairs, the keys being cache ids and the values being the result of `.info()` being called on each cache.

##### `CacheFactory.keySet()`

Return the ids of all registered caches as an object.

##### `CacheFactory.keys()`

Return the ids of all registered caches as an array.

##### `CacheFactory.destroy(cacheId)`

Destroy the cache with the given `cacheId`.

##### `CacheFactory.destroyAll()`

Destroy all registered caches.

##### `CacheFactory.clearAll()`

Remove all data from all registered caches.

##### `CacheFactory.enableAll()`

Enable all registered caches.

##### `CacheFactory.disableAll()`

Disable all registered caches.

##### `CacheFactory.touchAll()`

Call `.touch()` on all registered caches.

##### `CacheFactory.removeExpiredFromAll()`

Call `.removeExpired()` on all registered caches. Returns a hash of any expired items, keyed by cache id.

##### `Cache#get(key[, options])`

Return the item with the given `key`. `options`, if provided, must be an object.

If the cache is in `passive` mode, then `options.onExpire` can be a function that will be called with the `key` and `value` of the requested item if the requested item is expired, with the `get` call itself returning undefined.

##### `Cache#put(key, value[, options])`

Insert the item with the given `key` and `value` into the cache. `options`, if provided, must be an object.

If inserting a promise, `options.storeOnReject` determines whether to insert the rejection value if the promise rejects (overriding the default `storeOnReject` setting for the cache).
If inserting a promise, `options.storeOnResolve` determines whether to insert the resolved value if the promise resolves (overriding the default `storeOnResolve` setting for the cache).

##### `Cache.remove(key)`

Remove and return the item with the given `key`, if it is in the cache.

##### `Cache.removeAll()`

Remove all items in the cache.

##### `Cache.removeExpired()`

Remove and return all expired items in the cache.

##### `Cache.destroy()`

Completely destroy this cache and its data.

##### `Cache#info([key])`

`Cache#info()` returns an object containing information about the cache.

`Cache#info(key)` returns an object containing information about the item with the given `key`, if the item is in the cache.

##### `Cache#keySet()`

Return the keys of all items in the cache as an object.

##### `Cache#keys()`

Return the keys of all items in the cache as an array.

##### `Cache#enable()`

Enable the cache.

##### `Cache#disable()`

Disable the cache.

##### `Cache#touch([key])`

`Cache#touch()` will "touch" all items in the cache.
`Cache#touch(key)` will "touch" the item with the given `key`.

##### `Cache#setCacheFlushInterval(cacheFlushInterval)`

Set the `cacheFlushInterval` for the cache.

##### `Cache#setCapacity(capacity)`

Set the `capacity` for the cache. Setting this lower than the current item count will result in those items being removed.

##### `Cache#setDeleteOnExpire(deleteOnExpire)`

Set the `deleteOnExpire` for the cache.

##### `Cache#setMaxAge(maxAge)`

Set the `maxAge` for the cache.

##### `Cache#setOnExpire(onExpire)`

Set the `onExpire` for the cache.

##### `Cache#setRecycleFreq(recycleFreq)`

Set the `recycleFreq` for the cache.

##### `Cache#setStorageMode(storageMode)`

Set the `storageMode` for the cache. This will move data from the current storage medium to the new one.

##### `Cache#setOptions(options[, strict])`

Set multiple options for the cache at a time. Setting `strict` to `true` will reset options for the cache that are not specifically set in the `options` hash to `CacheFactoryProvider.defaults`.

### License
[MIT License](https://github.com/jmdobry/cachefactory/blob/master/LICENSE)

Copyright (C) 2015 Jason Dobry

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
