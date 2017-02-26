define('app', [
  'cachefactory'
], function (CacheFactoryModule) {
  var cacheFactory = new CacheFactoryModule.CacheFactory();
  return cacheFactory.createCache('my-cache');
});
