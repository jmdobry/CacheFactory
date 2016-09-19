import {
  assert,
  CacheFactory,
  TYPES_EXCEPT_NUMBER
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#setCapacity', function () {
  it('should set capacity', function () {
    const cache = new Cache(this.testId)
    cache.setCapacity(1234)
    assert.strictEqual(cache.capacity, 1234)
  })

  it('should reset capacity', function () {
    const cache = new Cache(this.testId)
    cache.setCapacity(null)
    assert.strictEqual(cache.capacity, Number.MAX_VALUE)
  })

  it('should throw a TypeError if capacity is not a number', function () {
    TYPES_EXCEPT_NUMBER.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { capacity: value })
        console.log(cache)
      }, TypeError, '"capacity" must be a number!')
    })
  })

  it('should throw an Error if capacity is less than or equal to zero', function () {
    assert.throws(() => {
      const cache = new Cache(this.testId, { capacity: 0 })
      console.log(cache)
    }, Error, '"capacity" must be greater than zero!')
    assert.throws(() => {
      const cache = new Cache(this.testId, { capacity: -1 })
      console.log(cache)
    }, Error, '"capacity" must be greater than zero!')
  })
})
