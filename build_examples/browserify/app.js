// normally this would be var CacheFactory = require('cachefactory');
var CacheFactory = require('../../');

var cacheFactory = new CacheFactory();
var cache = cacheFactory.createCache('my-cache');

cache.put('msg', 'It works!');

document.getElementById('main').innerHTML = cache.get('msg');
