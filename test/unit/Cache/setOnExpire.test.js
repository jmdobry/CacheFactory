import {
  assert,
  CacheFactory,
  TYPES_EXCEPT_FUNCTION
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#setOnExpire', function () {
  it('should set onExpire', function () {
    function onExpire () {}

    const cache = new Cache(this.testId)
    cache.setOnExpire(onExpire)
    assert.strictEqual(cache.onExpire, onExpire)
  })

  it('should reset onExpire', function () {
    function onExpire () {}

    const cache = new Cache(this.testId, { onExpire: onExpire })
    assert.strictEqual(cache.onExpire, onExpire)
    cache.setOnExpire(null)
    assert.strictEqual(cache.onExpire, null)
  })

  it('should throw a TypeError if onExpire is not a function', function () {
    TYPES_EXCEPT_FUNCTION.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { onExpire: value })
        console.log(cache)
      }, TypeError, '"onExpire" must be a function!')
    })
  })
})
