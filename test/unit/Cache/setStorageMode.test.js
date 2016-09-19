import {
  assert,
  CacheFactory,
  TYPES_EXCEPT_OBJECT,
  TYPES_EXCEPT_STRING
} from '../../_setup'

describe('Cache#setStorageMode', function () {
  it('should set storageMode', function () {
    const cache = new CacheFactory.Cache(this.testId)
    cache.setStorageMode('localStorage')
    assert.strictEqual(cache.storageMode, 'localStorage')
    assert.strictEqual(cache.$$storage(), localStorage)
  })

  it('should set storageImpl', function () {
    const cache = new CacheFactory.Cache(this.testId)
    const polyfill = {
      setItem: () => {},
      getItem: () => {},
      removeItem: () => {}
    }
    cache.setStorageMode('localStorage', polyfill)
    assert.strictEqual(cache.storageMode, 'localStorage')
    assert.strictEqual(cache.$$storage(), polyfill)
  })

  it('should throw a TypeError if storageMode is not a string', function () {
    const cache = new CacheFactory.Cache(this.testId)
    TYPES_EXCEPT_STRING.forEach(function (value) {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        cache.setStorageMode(value)
      }, TypeError, '"storageMode" must be a string!')
    })
  })

  it('should throw an Error if storageMode is not an allowed value', function () {
    const cache = new CacheFactory.Cache(this.testId)
    assert.throws(() => {
      cache.setStorageMode('foo')
    }, Error, '"storageMode" must be "memory", "localStorage", or "sessionStorage"!')
  })

  it('should throw a TypeError if storageImpl is not an object', function () {
    const cache = new CacheFactory.Cache(this.testId)
    TYPES_EXCEPT_OBJECT.forEach(function (value) {
      if (!value) {
        return
      }
      assert.throws(() => {
        cache.setStorageMode('localStorage', value)
      }, TypeError, '"storageImpl" must be an object!')
    })
  })

  it('should throw an Error if storageImpl down not implement setItem', function () {
    assert.throws(() => {
      const cache = new CacheFactory.Cache(this.testId)
      cache.setStorageMode('localStorage', {})
    }, Error, '"storageImpl" must implement "setItem(key, value)"!')
  })

  it('should throw an Error if storageImpl down not implement getItem', function () {
    assert.throws(() => {
      const cache = new CacheFactory.Cache(this.testId)
      cache.setStorageMode('localStorage', { setItem: () => {} })
    }, Error, '"storageImpl" must implement "getItem(key)"!')
  })

  it('should throw an Error if storageImpl down not implement removeItem', function () {
    assert.throws(() => {
      const cache = new CacheFactory.Cache(this.testId)
      cache.setStorageMode('localStorage', { setItem: () => {}, getItem: () => {} })
    }, Error, '"storageImpl" must implement "removeItem(key)"!')
  })

  it('should not use localStorage if it is not available.', function () {
    function setItem () {
      throw new Error()
    }

    const options = {
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    }
    const orig = localStorage.setItem
    localStorage.setItem = setItem
    if (localStorage.setItem === setItem) {
      const cache = new CacheFactory.Cache('CacheFactory.cache', options)
      assert.isDefined(cache)
      assert.strictEqual(cache.info().id, 'CacheFactory.cache')
      assert.strictEqual(cache.info().deleteOnExpire, options.deleteOnExpire)
      assert.strictEqual(cache.info().storageMode, 'memory')
      assert.isUndefined(cache.info().storageImpl)
      localStorage.setItem = orig
    } else {
      console.log('skipping because Firefox!')
    }
  })

  it('should not use sessionStorage if it is not available.', function () {
    function setItem () {
      throw new Error()
    }

    const options = {
      deleteOnExpire: 'aggressive',
      storageMode: 'sessionStorage'
    }
    const orig = sessionStorage.setItem
    sessionStorage.setItem = setItem
    if (sessionStorage.setItem === setItem) {
      const cache = new CacheFactory.Cache('CacheFactory.cache', options)
      assert.isDefined(cache)
      assert.strictEqual(cache.info().id, 'CacheFactory.cache')
      assert.strictEqual(cache.info().deleteOnExpire, options.deleteOnExpire)
      assert.strictEqual(cache.info().storageMode, 'memory')
      assert.isUndefined(cache.info().storageImpl)
      sessionStorage.setItem = orig
    } else {
      console.log('skipping because Firefox!')
    }
  })
})
