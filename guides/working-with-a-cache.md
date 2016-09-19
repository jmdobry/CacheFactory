We can retrieve items from a cache like so:

```js
const profile = profileCache.get('/profiles/34');

profile.name; // 'John'
```

And get information about items in the cache:

```js
const info = profileCache.info('/profiles/34');

info.isExpired; // false
// etc.
```

and information about the cache itself:

```js
const info = profileCache.info();

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

cacheFactory.get('profileCache'); // undefined
```
