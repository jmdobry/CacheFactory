// normally this would be var CacheFactory = require('cachefactory');
var CacheFactory = require('../../');

var testCache = CacheFactory.createCache('test');

testCache.put('foo', 'bar');

document.getElementById('main').innerHTML = testCache.get('foo');
