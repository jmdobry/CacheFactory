require.config({
  paths: {
    'cachefactory': '../../dist/cachefactory'
  }
});

require([
    'app'
  ], function (testCache) {
    testCache.put('msg', 'It works!');

    document.getElementById('main').innerHTML = testCache.get('msg');
  }
);
