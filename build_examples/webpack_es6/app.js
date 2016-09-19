// normally this would be var import CacheFactory from 'cachefactory'
import CacheFactory from '../../';

const cacheFactory = new CacheFactory();
let cache = cacheFactory.createCache('my-cache');

cache.put('msg', 'It works!');

document.getElementById('main').innerHTML = cache.get('msg');
