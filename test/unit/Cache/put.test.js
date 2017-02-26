import {
  assert,
  Cache,
  TYPES_EXCEPT_STRING_OR_NUMBER
} from '../../_setup'

describe('Cache#put', function () {
  it('should do nothing if the cache is disabled', function () {
    const cache = new Cache(this.testId, { enabled: false })

    assert.strictEqual(cache.info().size, 0)
    assert.strictEqual(cache.put('1', 'item'), undefined)
    assert.strictEqual(cache.info().size, 0)
  })

  it('should throw an error if "key" is not a string.', function () {
    const cache = new Cache(this.testId)
    TYPES_EXCEPT_STRING_OR_NUMBER.forEach((value) => {
      assert.throws(() => {
        cache.put(value, 'bar')
      }, TypeError, '"key" must be a string!')
    })
  })

  it('should not add values that are not defined.', function () {
    const cache = new Cache(this.testId)
    cache.put('item', null)
    assert.strictEqual(cache.get('item'), undefined)
    cache.put('item', undefined)
    assert.strictEqual(cache.get('item'), undefined)
  })

  it('should increase the size of the cache by one.', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache.info().size, 0)
    cache.put('item', 'value1')
    assert.strictEqual(cache.info().size, 1)
    cache.put('item2', 'value2')
    assert.strictEqual(cache.info().size, 2)
  })

  it('should overwrite an item if it is re-added to the cache.', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache.info().size, 0)
    cache.put('item', 'value1')
    assert.strictEqual(cache.info().size, 1)
    cache.put('item', 'value2')
    assert.strictEqual(cache.info().size, 1)
    assert.strictEqual(cache.get('item'), 'value2')
  })

  it('should remove the least recently used item if the capacity has been reached.', function () {
    const cache = new Cache(this.testId, { capacity: 2 })
    assert.strictEqual(cache.info().size, 0)
    cache.put('item1', 'value1')
    assert.strictEqual(cache.info().size, 1)
    cache.put('item2', 'value2')
    assert.strictEqual(cache.info().size, 2)
    cache.put('item3', 'value3')
    assert.strictEqual(cache.info().size, 2)
    assert.strictEqual(cache.get('item1'), undefined)
    assert.strictEqual(cache.get('item2'), 'value2')
    assert.strictEqual(cache.get('item3'), 'value3')
    cache.get('item2')
    cache.put('item1', 'value1')
    assert.strictEqual(cache.get('item3'), undefined)
    assert.strictEqual(cache.get('item1'), 'value1')
    assert.strictEqual(cache.get('item2'), 'value2')
  })

  it('should not delete items if maxAge is specified and deleteOnExpire is set to "none".', function (done) {
    const cache = new Cache(this.testId, {maxAge: 10, deleteOnExpire: 'none', recycleFreq: 20})
    cache.put('item1', 'value1')
    assert.strictEqual(cache.get('item1'), 'value1')
    setTimeout(function () {
      assert.strictEqual(cache.get('item1'), 'value1')
      assert.strictEqual(cache.info('item1').isExpired, true)
      done()
    }, 100)
  })

  it('should remove items if maxAge is specified and deleteOnExpire is set to "aggressive".', function (done) {
    const cache = new Cache(this.testId, {maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20})
    cache.put('item1', 'value1')
    assert.strictEqual(cache.get('item1'), 'value1')
    setTimeout(function () {
      assert.isUndefined(cache.info('item1'))
      assert.isUndefined(cache.get('item1'))

      done()
    }, 100)
  })

  it('should remove items if an item-specific maxAge is specified and deleteOnExpire is set to "aggressive".', function (done) {
    const cache = new Cache(this.testId, {maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20})
    cache.put('item1', 'value1', { maxAge: 10 })
    cache.put('item2', 'value2')
    assert.strictEqual(cache.get('item1'), 'value1')
    assert.strictEqual(cache.get('item2'), 'value2')
    setTimeout(function () {
      assert.isUndefined(cache.info('item1'))
      assert.isUndefined(cache.get('item1'))
      assert.isDefined(cache.info('item2'))
      assert.isDefined(cache.get('item2'))

      done()
    }, 100)
  })

  it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive".', function (done) {
    const cache = new Cache(this.testId, { maxAge: 10, deleteOnExpire: 'passive' })
    cache.put('item1', 'value1')
    assert.strictEqual(cache.get('item1'), 'value1')
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired)
      assert.isUndefined(cache.get('item1'))

      done()
    }, 100)
  })

  it('should touch an item.', function (done) {
    const cache = new Cache(this.testId, { maxAge: 10, deleteOnExpire: 'passive' })
    cache.put('item1', 'value1')
    assert.strictEqual(cache.get('item1'), 'value1')
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired)
      cache.touch('item1')
      assert.strictEqual(cache.get('item1'), 'value1')

      done()
    }, 100)
  })

  it('should  allow an item touched with options.', function (done) {
    const cache = new Cache(this.testId, { maxAge: 30, deleteOnExpire: 'aggressive' })
    const options = { maxAge: 15 }
    cache.put('item1', 'value1', options)
    assert.strictEqual(cache.get('item1'), 'value1')
    setTimeout(function () {
      cache.touch('item1', options)
      assert.strictEqual(cache.get('item1'), 'value1')
      setTimeout(function () {
        assert.strictEqual(cache.get('item1'), 'value1')
        done()
      }, 10)
    }, 10)
  })

  it('should handle normal promises.', function (done) {
    const cache = new Cache(this.testId, {
      maxAge: 30,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storeOnResolve: true,
      storeOnReject: true
    })
    const promise = new Promise(function (resolve) {
      resolve('value1')
      setTimeout(function () {
        assert.strictEqual(cache.get('item1'), 'value1')
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'))
          done()
        }, 100)
      }, 15)
    })
    const item = cache.put('item1', promise)
    assert.strictEqual(typeof item.then, 'function')
    assert.strictEqual(typeof cache.get('item1').then, 'function')
  })

  it('should handle normal promises using localStorage.', function (done) {
    const cache = new Cache(this.testId, {
      maxAge: 30,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    })
    var promise = new Promise(function (resolve) {
      try {
        resolve('value1')
        setTimeout(function () {
          assert.strictEqual(cache.get('item1'), 'value1')
          setTimeout(function () {
            assert.isUndefined(cache.get('item1'))
            done()
          }, 100)
        }, 15)
      } catch (err) {
        done(err)
      }
    })
    var item = cache.put('item1', promise)
    assert.strictEqual(typeof item.then, 'function')
    assert.strictEqual(typeof cache.get('item1').then, 'function')
  })

  it('should work with promises when storeOnResolve is true.', function (done) {
    const promise = new Promise(function (resolve) {
      setTimeout(function () {
        resolve('value')
        setTimeout(function () {
          try {
            assert.strictEqual(cache.get('test'), 'value')
            done()
          } catch (e) {
            done(e)
          }
        }, 10)
      }, 50)
    })
    const cache = new Cache(this.testId, {
      storeOnResolve: true
    })
    cache.put('test', promise)
  })

  it('should work with rejected promises when storeOnReject is false.', function (done) {
    const promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject('error')
        setTimeout(function () {
          try {
            assert.strictEqual(typeof cache.get('test').then, 'function')
            done()
          } catch (e) {
            done(e)
          }
        }, 10)
      }, 50)
    })
    const cache = new Cache('cache', {storeOnResolve: true})
    cache.put('test', promise)
  })

  it('should work with rejected promises.', function (done) {
    var promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject('error')
        setTimeout(function () {
          try {
            assert.strictEqual(cache.get('test'), 'error')
            done()
          } catch (e) {
            done(e)
          }
        }, 10)
      }, 50)
    })
    const cache = new Cache('cache', {
      storeOnResolve: true,
      storeOnReject: true
    })
    cache.put('test', promise)
  })

  it('should save data to localStorage when storageMode is used.', function () {
    var localStorageCache = new Cache('localStorageCache', {storageMode: 'localStorage'})
    var sessionStorageCache = new Cache('sessionStorageCache', {storageMode: 'sessionStorage'})

    localStorageCache.put('item1', 'value1')
    sessionStorageCache.put('item1', 'value1')

    assert.strictEqual(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1"]')
    assert.strictEqual(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1"]')
  })
})
