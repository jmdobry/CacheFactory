import {
  assert,
  Cache
} from '../../_setup'

describe('Cache#removeExpired', function () {
  it('should remove all expired items when deleteOnExpire is "none"', function (done) {
    const cache = new Cache(this.testId, {
      deleteOnExpire: 'none',
      maxAge: 10,
      recycleFreq: 20
    })
    const value1 = 'value1'
    const value2 = 2
    const value3 = {
      value3: 'stuff'
    }
    cache.put('item1', value1)
    cache.put('item2', value2)
    cache.put('item3', value3)

    setTimeout(function () {
      const expired = cache.removeExpired()
      assert.deepEqual(expired, {
        item1: value1,
        item2: value2,
        item3: value3
      })
      assert.strictEqual(cache.info().size, 0)
      cache.put('item3', value3)
      assert.strictEqual(cache.info().size, 1)

      done()
    }, 1000)
  })
})
