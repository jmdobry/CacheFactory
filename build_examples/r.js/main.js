require.config({
  paths: {
    'cachefactory': '../../dist/cachefactory'
  }
});

require([
    'app'
  ], function (testCache) {
    testCache.put('foo', 'bar');

    document.getElementById('main').innerHTML = testCache.get('foo');
  }
);
