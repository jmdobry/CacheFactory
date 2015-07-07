define('app', [
  'cachefactory'
], function (CacheFactory) {
  return CacheFactory.createCache('test');
});
