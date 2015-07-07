// normally this would be var import CacheFactory from 'cachefactory'
import CacheFactory from '../../';

let testCache = CacheFactory.createCache('test');

testCache.put('foo', 'bar');

document.getElementById('main').innerHTML = testCache.get('foo');
