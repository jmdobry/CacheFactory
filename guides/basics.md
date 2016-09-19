Grab `CacheFactory` then create a cache. Let's go:

```js
import CacheFactory from 'cachefactory';

const cacheFactory = new CacheFactory();
let cache;

// Check to make sure the cache doesn't already exist
if (!cacheFactory.exists('my-cache')) {
  cache = cacheFactory.createCache('my-cache');
}
```

Let's add some items to the cache:

```js
cache.put('/profiles/34', {
  name: 'John',
  skills: ['programming', 'piano']
});

cache.put('/profiles/22', {
  name: 'Sally',
  skills: ['marketing', 'climbing', 'painting']
});
```

Right now, these items will stay in the cache until a page refresh.

Let's have items which are added to the cache expire after one hour:

```js
cache = cacheFactory.createCache('my-cache', {
  // 1 hour
  maxAge: 60 * 60 * 1000
});
```

Perfect. Say we also want the items removed from the cache when they expire:

```js
cache = cacheFactory.createCache('my-cache', {
  // 1 hour
  maxAge: 60 * 60 * 1000,

  deleteOnExpire: 'aggressive'
});
```

Let's say that when the items do expire, we want to refresh them with new values:

```js
cache = cacheFactory.createCache('my-cache', {
  // 1 hour
  maxAge: 60 * 60 * 1000,

  deleteOnExpire: 'aggressive',

  onExpire: function (key, value) {
    myAjaxLib.get(key).success((data) => {
      this.put(key, data);
    });
  }
});
```

Or say we want all of our caches to use that configuration as their default:

```js
import CacheFactory from 'cachefactory';
const { defaults } = CacheFactory;

myUtils.extend(defaults, {
  maxAge: 60 * 60 * 1000,
  deleteOnExpire: 'aggressive',
  onExpire: function (key, value) {
    // "this" refers to the cache instance
    myAjaxLib.get(key).success((data) => {
      this.put(key, data);
    });
  }
});
```
