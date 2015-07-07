describe('Cache#put(key, value[, options])', function () {
  it('should do nothing if the cache is disabled.', function () {
    var cache = TestCacheFactory('DSCache.put.cache.1', {disabled: true});

    assert.equal(cache.info().size, 0);
    assert.isUndefined(cache.put('1', 'item'));
    assert.equal(cache.info().size, 0);
  });
  it('should throw an error if "key" is not a string.', function () {
    var cache = TestCacheFactory('DSCache.put.cache.2');
    for (var i = 0; i < TYPES_EXCEPT_STRING_OR_NUMBER.length; i++) {
      try {
        cache.put(TYPES_EXCEPT_STRING_OR_NUMBER[i], 'value');
        fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
      } catch (err) {
        assert.equal(err.message, 'key must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
    }
  });
  it('should not add values that are not defined.', function () {
    var cache = TestCacheFactory('put-cache-3');
    cache.put('item', null);
    assert.equal(cache.get('item'), undefined);
    cache.put('item', undefined);
    assert.equal(cache.get('item'), undefined);
  });
  it('should increase the size of the cache by one.', function () {
    var cache = TestCacheFactory('put-cache-4');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item2', 'value2');
    assert.equal(cache.info().size, 2);
  });
  it('should overwrite an item if it is re-added to the cache.', function () {
    var cache = TestCacheFactory('put-cache-5');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item', 'value2');
    assert.equal(cache.info().size, 1);
    assert.equal(cache.get('item'), 'value2');
  });
  it('should remove the least recently used item if the capacity has been reached.', function () {
    var cache = TestCacheFactory('put-cache-6', {capacity: 2});
    assert.equal(cache.info().size, 0);
    cache.put('item1', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item2', 'value2');
    assert.equal(cache.info().size, 2);
    cache.put('item3', 'value3');
    assert.equal(cache.info().size, 2);
    assert.equal(cache.get('item1'), undefined);
    assert.equal(cache.get('item2'), 'value2');
    assert.equal(cache.get('item3'), 'value3');
    cache.get('item2');
    cache.put('item1', 'value1');
    assert.equal(cache.get('item3'), undefined);
    assert.equal(cache.get('item1'), 'value1');
    assert.equal(cache.get('item2'), 'value2');
  });
  it('should not delete items if maxAge is specified and deleteOnExpire is set to "none".', function (done) {
    var cache = TestCacheFactory('put-cache-7', {maxAge: 10, deleteOnExpire: 'none', recycleFreq: 20});
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.equal(cache.get('item1'), 'value1');
      assert.equal(cache.info('item1').isExpired, true);
      done();
    }, 100);
  });
  it('should remove items if maxAge is specified and deleteOnExpire is set to "aggressive".', function (done) {
    var cache = TestCacheFactory('put-cache-8', {maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20});
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isUndefined(cache.info('item1'));
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive".', function (done) {
    var cache = TestCacheFactory('put-cache-9', {maxAge: 10, deleteOnExpire: 'passive'});
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired);
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should touch an item.', function (done) {
    var cache = TestCacheFactory('put-cache-10', {maxAge: 10, deleteOnExpire: 'passive'});
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired);
      cache.touch('item1');
      assert.equal(cache.get('item1'), 'value1');

      done();
    }, 100);
  });
  it('should handle normal promises.', function (done) {
    var cache = TestCacheFactory('put-cache-11', {
      maxAge: 30,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storeOnResolve: true,
      storeOnReject: true
    });
    var promise = new Promise(function (resolve) {
      resolve('value1');
      setTimeout(function () {
        assert.equal(cache.get('item1'), 'value1');
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'));
          done();
        }, 100);
      }, 5);
    });
    var item = cache.put('item1', promise);
    assert.equal(typeof item.then, 'function');
    assert.equal(typeof cache.get('item1').then, 'function');
  });
  it('should handle normal promises using localStorage.', function (done) {
    var cache = TestCacheFactory('put-cache-12', {
      maxAge: 30,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    });
    var promise = new Promise(function (resolve) {
      try {
        resolve('value1');
        setTimeout(function () {
          assert.equal(cache.get('item1'), 'value1');
          setTimeout(function () {
            assert.isUndefined(cache.get('item1'));
            done();
          }, 100);
        }, 5);
      } catch (err) {
        done(err);
      }
    });
    var item = cache.put('item1', promise);
    assert.equal(typeof item.then, 'function');
    assert.equal(typeof cache.get('item1').then, 'function');
  });
  it('should work with promises when storeOnResolve is true.', function (done) {
    var promise = new Promise(function (resolve) {
      setTimeout(function () {
        resolve('value');
        setTimeout(function () {
          try {
            assert.equal(cache.get('test'), 'value');
            done();
          } catch (e) {
            done(e);
          }
        }, 10);
      }, 50);
    });
    var cache = TestCacheFactory('put-cache-13', {
      storeOnResolve: true
    });
    cache.put('test', promise);
  });
  it('should work with rejected promises when storeOnReject is false.', function (done) {
    var promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject('error');
        setTimeout(function () {
          try {
            assert.equal(typeof cache.get('test').then, 'function');
            done();
          } catch (e) {
            done(e);
          }
        }, 10);
      }, 50);
    });
    var cache = TestCacheFactory('cache', {storeOnResolve: true});
    cache.put('test', promise);
  });
  it('should work with rejected promises.', function (done) {
    var promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject('error');
        setTimeout(function () {
          try {
            assert.equal(cache.get('test'), 'error');
            done();
          } catch (e) {
            done(e);
          }
        }, 10);
      }, 50);
    });
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true,
      storeOnReject: true
    });
    cache.put('test', promise);
  });
  it('should save data to localStorage when storageMode is used.', function () {
    var localStorageCache = TestCacheFactory('localStorageCache', {storageMode: 'localStorage'});
    var sessionStorageCache = TestCacheFactory('sessionStorageCache', {storageMode: 'sessionStorage'});

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');

    assert.equal(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1');
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1"]');
    assert.equal(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1');
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1"]');
  });
});
