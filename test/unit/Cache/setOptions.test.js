import {
  assert,
  Cache,
  TYPES_EXCEPT_OBJECT
} from '../../_setup'

describe('Cache#setOptions', function () {
  it('should throw an error if "options" is not an object', function () {
    const cache = new Cache(this.testId)
    TYPES_EXCEPT_OBJECT.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        cache.setOptions(value)
      }, TypeError, '"options" must be an object!')
    })
  })

  it('should correctly reset to defaults if strict mode is true', function () {
    const onExpire = function () {}
    const cache = new Cache(this.testId, {
      maxAge: 100,
      cacheFlushInterval: 200,
      onExpire: onExpire,
      storageMode: 'localStorage',
      enabled: false
    })
    assert.strictEqual(cache.info().maxAge, 100)
    assert.strictEqual(cache.info().cacheFlushInterval, 200)
    assert.strictEqual(cache.info().onExpire, onExpire)
    assert.strictEqual(cache.info().storageMode, 'localStorage')
    assert.strictEqual(cache.info().enabled, false)
    cache.setOptions({}, true)
    assert.strictEqual(cache.info().maxAge, Number.MAX_VALUE)
    assert.strictEqual(cache.info().cacheFlushInterval, null)
    assert.strictEqual(cache.info().onExpire, null)
    assert.strictEqual(cache.info().storageMode, 'memory')
    assert.strictEqual(cache.info().enabled, true)
  })

  it('should correctly modify the capacity of a cache', function (done) {
    const cache = new Cache('cache')
    assert.strictEqual(cache.info().capacity, Number.MAX_VALUE)
    cache.setOptions({ capacity: 5 }, false)
    assert.strictEqual(cache.info().capacity, 5)
    cache.put('item1', 1)
    cache.put('item2', 2)
    cache.put('item3', 3)
    cache.put('item4', 4)
    cache.put('item5', 5)
    cache.put('item6', 6)
    assert.isUndefined(cache.get('item1'))
    setTimeout(function () {
      cache.get('item2')
      cache.get('item3')
      cache.get('item6')
      cache.setOptions({ capacity: 3 }, false)
      // Least-recently used items over the new capacity should have been removed.
      assert.isUndefined(cache.get('item4'))
      assert.isUndefined(cache.get('item5'))
      assert.strictEqual(cache.info().size, 3)

      done()
    }, 50)
  })

  it('should correctly modify the maxAge of a cache', function (done) {
    const cache = new Cache('cache')
    assert.strictEqual(cache.info().maxAge, Number.MAX_VALUE)
    cache.setOptions({ maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false)
    assert.strictEqual(cache.info().maxAge, 1000)
    cache.put('item1', 1)
    cache.put('item2', 2)
    setTimeout(function () {
      assert.isDefined(cache.get('item1'))
      assert.isDefined(cache.get('item2'))
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false)
      assert.strictEqual(cache.info().maxAge, 10)
      cache.put('item1', 1)
      cache.put('item2', 2)
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'))
        assert.isUndefined(cache.get('item2'))
        cache.put('item1', 1)
        cache.put('item2', 2)
        cache.setOptions({ maxAge: null, deleteOnExpire: 'none', recycleFreq: 20 }, false)
        assert.strictEqual(cache.info().maxAge, Number.MAX_VALUE)
        // The new items should be removed after 500 ms (the new maxAge)
        setTimeout(function () {
          assert.strictEqual(cache.get('item1'), 1)
          assert.isNumber(cache.info('item1').expires)
          assert.strictEqual(cache.get('item2'), 2)
          assert.isNumber(cache.info('item2').expires)

          cache.setOptions({ maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false)
          cache.put('item1', 1)
          cache.put('item2', 2)
          // The new items should be removed after 500 ms (the new maxAge)
          setTimeout(function () {
            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false)
            assert.isUndefined(cache.get('item1'))
            assert.isUndefined(cache.get('item2'))

            done()
          }, 100)
        }, 100)
      }, 100)
    }, 100)
  })

  it('should correctly modify the cacheFlushInterval of a cache', function (done) {
    const cache = new Cache('cache')
    assert.strictEqual(cache.info().cacheFlushInterval, null)
    cache.setOptions({ cacheFlushInterval: 10 }, false)
    assert.strictEqual(cache.info().cacheFlushInterval, 10)
    cache.put('item1', 1)
    cache.put('item2', 2)
    // The first items should be removed after 2000 ms
    setTimeout(function () {
      assert.isUndefined(cache.get('item1'))
      assert.isUndefined(cache.get('item2'))
      cache.setOptions({ cacheFlushInterval: 20 }, false)
      assert.strictEqual(cache.info().cacheFlushInterval, 20)
      cache.put('item1', 1)
      cache.put('item2', 2)
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'))
        assert.isUndefined(cache.get('item2'))
        cache.setOptions({ cacheFlushInterval: 20 })
        assert.strictEqual(cache.info().cacheFlushInterval, 20)
        cache.put('item1', 1)
        cache.put('item2', 2)
        // The new items should be removed after 500 ms (the new maxAge)
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'))
          assert.isUndefined(cache.get('item2'))

          done()
        }, 100)
      }, 100)
    }, 100)
  })

  it('should correctly modify the deleteOnExpire of a cache', function (done) {
    const cache = new Cache('cache', { maxAge: 10 })
    assert.strictEqual(cache.info().deleteOnExpire, 'none')
    cache.setOptions({ deleteOnExpire: 'passive' })
    assert.strictEqual(cache.info().deleteOnExpire, 'passive')
    cache.put('item1', 1)
    cache.put('item2', 2)
    // The first items should be removed after 2000 ms
    setTimeout(function () {
      assert.isUndefined(cache.get('item1'))
      assert.isUndefined(cache.get('item2'))
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false)
      assert.strictEqual(cache.info().deleteOnExpire, 'aggressive')
      cache.put('item1', 1)
      cache.put('item2', 2)
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'))
        assert.isUndefined(cache.get('item2'))

        done()
      }, 100)
    }, 100)
  })

  it('should correctly set configuration to default when "strict" is true', function () {
    const cache = new Cache('cache', {
      capacity: 10,
      maxAge: 1000,
      cacheFlushInterval: 1000,
      deleteOnExpire: 'aggressive',
      recycleFreq: 20000,
      storageMode: 'localStorage'
    })
    cache.setOptions({}, true)
    const cacheInfo = cache.info()
    assert.strictEqual(cacheInfo.id, 'cache')
    assert.strictEqual(cacheInfo.capacity, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo.size, 0)
    assert.strictEqual(cacheInfo.recycleFreq, 1000)
    assert.strictEqual(cacheInfo.maxAge, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo.cacheFlushInterval, null)
    assert.strictEqual(cacheInfo.deleteOnExpire, 'none')
    assert.strictEqual(cacheInfo.storageMode, 'memory')
    assert.strictEqual(cacheInfo.onExpire, null)
  })
})
