import {
  assert,
  Cache,
  CACHE_DEFAULTS,
  TYPES_EXCEPT_STRING
} from '../../_setup'

describe('Cache', function () {
  it('should construct an instance of Cache', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache instanceof Cache, true)
  })

  it('should throw a TypeError if id is not a string', function () {
    TYPES_EXCEPT_STRING.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(value)
        console.log(cache)
      }, TypeError, '"id" must be a string!')
    })
  })

  it('should create a cache with default options', function () {
    const id = 'CacheFactory.cache'
    const cache = new Cache(id)

    assert.strictEqual(cache instanceof Cache, true)
    assert.deepEqual(cache, {
      capacity: CACHE_DEFAULTS.capacity,
      cacheFlushInterval: CACHE_DEFAULTS.cacheFlushInterval,
      deleteOnExpire: CACHE_DEFAULTS.deleteOnExpire,
      enabled: CACHE_DEFAULTS.enabled,
      id: id,
      maxAge: CACHE_DEFAULTS.maxAge,
      onExpire: CACHE_DEFAULTS.onExpire,
      recycleFreq: CACHE_DEFAULTS.recycleFreq,
      storageMode: CACHE_DEFAULTS.storageMode,
      storagePrefix: CACHE_DEFAULTS.storagePrefix,
      storeOnReject: CACHE_DEFAULTS.storeOnReject,
      storeOnResolve: CACHE_DEFAULTS.storeOnResolve
    })
  })

  it('should create a cache with custom options', function () {
    const options = {
      capacity: Math.floor((Math.random() * 100000) + 1),
      cacheFlushInterval: Math.floor((Math.random() * 100000) + 1),
      deleteOnExpire: 'aggressive',
      enabled: false,
      maxAge: Math.floor((Math.random() * 100000) + 1),
      onExpire: function () {},
      recycleFreq: 2000,
      storageMode: 'localStorage',
      storagePrefix: 'foo',
      storeOnReject: true,
      storeOnResolve: true
    }
    const cache = new Cache(this.testId, options)

    assert.deepEqual(cache, {
      capacity: options.capacity,
      cacheFlushInterval: options.cacheFlushInterval,
      deleteOnExpire: options.deleteOnExpire,
      enabled: options.enabled,
      id: this.testId,
      maxAge: options.maxAge,
      onExpire: options.onExpire,
      recycleFreq: options.recycleFreq,
      storageMode: options.storageMode,
      storagePrefix: options.storagePrefix,
      storeOnReject: options.storeOnReject,
      storeOnResolve: options.storeOnResolve
    })
  })
})
