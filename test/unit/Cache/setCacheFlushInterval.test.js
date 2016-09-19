import {
  assert,
  CacheFactory,
  TYPES_EXCEPT_NUMBER
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#setCacheFlushInterval', function () {
  it('should set cacheFlushInterval', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache.$$cacheFlushIntervalId, undefined)
    cache.setCacheFlushInterval(1234)
    assert.strictEqual(cache.cacheFlushInterval, 1234)
    assert.strictEqual(typeof cache.$$cacheFlushIntervalId, 'number')
  })

  it('should reset cacheFlushInterval', function () {
    const cache = new Cache(this.testId, { cacheFlushInterval: 1234 })
    assert.strictEqual(cache.cacheFlushInterval, 1234)
    assert.strictEqual(typeof cache.$$cacheFlushIntervalId, 'number')
    cache.setCacheFlushInterval(null)
    assert.strictEqual(cache.cacheFlushInterval, null)
    assert.strictEqual(cache.$$cacheFlushIntervalId, undefined)
  })

  it('should throw a TypeError if cacheFlushInterval is not a number', function () {
    TYPES_EXCEPT_NUMBER.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { cacheFlushInterval: value })
        console.log(cache)
      }, TypeError, '"cacheFlushInterval" must be a number!')
    })
  })

  it('should throw an Error if cacheFlushInterval is less than or equal to zero', function () {
    assert.throws(() => {
      const cache = new Cache(this.testId, { cacheFlushInterval: 0 })
      console.log(cache)
    }, Error, '"cacheFlushInterval" must be greater than zero!')
    assert.throws(() => {
      const cache = new Cache(this.testId, { cacheFlushInterval: -1 })
      console.log(cache)
    }, Error, '"cacheFlushInterval" must be greater than zero!')
  })
})
