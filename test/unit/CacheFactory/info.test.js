import {
  assert,
  CACHE_DEFAULTS
} from '../../_setup'

describe('CacheFactory#info', function () {
  it('should return info', function () {
    var cache = this.cacheFactory.createCache(this.testId)
    var info = this.cacheFactory.info()

    assert.strictEqual(info.size, 1)
    assert.strictEqual(info.capacity, CACHE_DEFAULTS.capacity)
    assert.strictEqual(info.maxAge, CACHE_DEFAULTS.maxAge)
    assert.strictEqual(info.cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval)
    assert.strictEqual(info.deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire)
    assert.strictEqual(info.onExpire, CACHE_DEFAULTS.onExpire)
    assert.strictEqual(info.recycleFreq, CACHE_DEFAULTS.recycleFreq)
    assert.strictEqual(info.storageMode, CACHE_DEFAULTS.storageMode)
    assert.strictEqual(info.storageImpl, CACHE_DEFAULTS.storageImpl)

    assert.deepEqual(info.caches[this.testId], cache.info())
  })
})
