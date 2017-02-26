import {
  assert,
  Cache,
  CACHE_DEFAULTS,
  TYPES_EXCEPT_NUMBER
} from '../../_setup'

describe('Cache#setRecycleFreq', function () {
  it('should set recycleFreq if deleteOneExpire is "aggressive"', function () {
    const cache = new Cache(this.testId, { deleteOnExpire: 'aggressive' })
    assert.strictEqual(typeof cache.$$recycleFreqId, 'number')
    cache.setRecycleFreq(1234)
    assert.strictEqual(cache.recycleFreq, 1234)
    assert.strictEqual(typeof cache.$$recycleFreqId, 'number')
  })

  it('should not set recycleFreq if deleteOneExpire is not "aggressive"', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache.$$recycleFreqId, undefined)
    cache.setRecycleFreq(1234)
    assert.strictEqual(cache.recycleFreq, 1234)
    assert.strictEqual(cache.$$recycleFreqId, undefined)
  })

  it('should reset recycleFreq', function () {
    const cache = new Cache(this.testId, { deleteOnExpire: 'aggressive' })
    assert.strictEqual(cache.recycleFreq, CACHE_DEFAULTS.recycleFreq)
    assert.strictEqual(typeof cache.$$recycleFreqId, 'number')
    cache.setRecycleFreq(null)
    assert.strictEqual(cache.recycleFreq, null)
    assert.strictEqual(cache.$$recycleFreqId, undefined)
  })

  it('should throw a TypeError if recycleFreq is not a number', function () {
    TYPES_EXCEPT_NUMBER.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { recycleFreq: value })
        console.log(cache)
      }, TypeError, '"recycleFreq" must be a number!')
    })
  })

  it('should throw an Error if recycleFreq is less than or equal to zero', function () {
    assert.throws(() => {
      const cache = new Cache(this.testId, { recycleFreq: 0 })
      console.log(cache)
    }, Error, '"recycleFreq" must be greater than zero!')
    assert.throws(() => {
      const cache = new Cache(this.testId, { recycleFreq: -1 })
      console.log(cache)
    }, Error, '"recycleFreq" must be greater than zero!')
  })
})
