define('app', [
  'cachefactory'
], function (CacheFactory) {
  var cacheFactory = new CacheFactory();
  return cacheFactory.createCache('my-cache');
});
