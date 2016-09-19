import {
  assert,
  CacheFactory
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#info', function () {
  it('should return the correct values.', function () {
    const onExpire = function () {}
    const cache = new Cache(this.testId + 1)
    const cache2 = new Cache(this.testId + 2, { maxAge: 1000 })
    const cache3 = new Cache(this.testId + 3, { cacheFlushInterval: 1000 })
    const cache4 = new Cache(this.testId + 4, { capacity: 1000 })
    const cache5 = new Cache(this.testId + 5, { storageMode: 'localStorage' })
    const cache6 = new Cache(this.testId + 6, { storageMode: 'sessionStorage' })
    const cache7 = new Cache(this.testId + 7, { maxAge: 100, onExpire: onExpire })

    const cacheInfo = cache.info()

    assert.strictEqual(cacheInfo.id, this.testId + 1)
    assert.strictEqual(cacheInfo.capacity, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo.size, 0)
    assert.strictEqual(cacheInfo.recycleFreq, 1000)
    assert.strictEqual(cacheInfo.maxAge, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo.cacheFlushInterval, null)
    assert.strictEqual(cacheInfo.deleteOnExpire, 'none')
    assert.strictEqual(cacheInfo.storageMode, 'memory')
    assert.strictEqual(cacheInfo.onExpire, null)
    cache.put('item', 'value')
    cache.put('item2', 'value2')

    // DSCache#info(key)
    assert.isUndefined(cache.info('non-existent item'))
    assert.isNumber(cache.info('item').created)
    assert.isNumber(cache.info('item').expires)
    assert.isFalse(cache.info('item').isExpired)
    assert.isNumber(cache.info('item').accessed)
    assert.isNumber(cache.info('item2').created)
    assert.isNumber(cache.info('item2').expires)
    assert.isFalse(cache.info('item2').isExpired)
    assert.isNumber(cache.info('item2').accessed)

    assert.strictEqual(cache.info().size, 2)

    const cacheInfo2 = cache2.info()
    assert.strictEqual(cacheInfo2.id, this.testId + 2)
    assert.strictEqual(cacheInfo2.capacity, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo2.size, 0)
    assert.strictEqual(cacheInfo2.recycleFreq, 1000)
    assert.strictEqual(cacheInfo2.maxAge, 1000)
    assert.strictEqual(cacheInfo2.cacheFlushInterval, null)
    assert.strictEqual(cacheInfo2.deleteOnExpire, 'none')
    assert.strictEqual(cacheInfo2.storageMode, 'memory')
    assert.strictEqual(cacheInfo2.onExpire, null)

    assert.strictEqual(cache3.info().id, this.testId + 3)
    assert.strictEqual(cache3.info().capacity, Number.MAX_VALUE)
    assert.strictEqual(cache3.info().cacheFlushInterval, 1000)
    assert.strictEqual(cache3.info().size, 0)

    const cacheInfo4 = cache4.info()
    assert.strictEqual(cacheInfo4.id, this.testId + 4)
    assert.strictEqual(cacheInfo4.capacity, 1000)
    assert.strictEqual(cacheInfo4.size, 0)
    assert.strictEqual(cacheInfo4.recycleFreq, 1000)
    assert.strictEqual(cacheInfo4.maxAge, Number.MAX_VALUE)
    assert.strictEqual(cacheInfo4.cacheFlushInterval, null)
    assert.strictEqual(cacheInfo4.deleteOnExpire, 'none')
    assert.strictEqual(cacheInfo4.storageMode, 'memory')
    assert.strictEqual(cacheInfo4.onExpire, null)
    if (localStorage) {
      assert.strictEqual(cache5.info().storageMode, 'localStorage', 'cache5 storageMode should be "memory"')
    } else {
      assert.strictEqual(cache5.info().storageMode, null)
    }
    if (sessionStorage) {
      assert.strictEqual(cache6.info().storageMode, 'sessionStorage')
    } else {
      assert.strictEqual(cache6.info().storageMode, null)
    }
    assert.strictEqual(cache7.info().onExpire, onExpire)
  })
})
