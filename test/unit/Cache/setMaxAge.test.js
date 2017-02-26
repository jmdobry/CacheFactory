import {
  assert,
  Cache,
  TYPES_EXCEPT_NUMBER
} from '../../_setup'

describe('Cache#setMaxAge', function () {
  it('should set maxAge', function () {
    const cache = new Cache(this.testId)
    cache.setMaxAge(1234)
    assert.strictEqual(cache.maxAge, 1234)
  })

  it('should reset maxAge', function () {
    const cache = new Cache(this.testId)
    cache.setMaxAge(null)
    assert.strictEqual(cache.maxAge, Number.MAX_VALUE)
  })

  it('should throw a TypeError if maxAge is not a number', function () {
    TYPES_EXCEPT_NUMBER.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { maxAge: value })
        console.log(cache)
      }, TypeError, '"maxAge" must be a number!')
    })
  })

  it('should throw an Error if maxAge is less than or equal to zero', function () {
    assert.throws(() => {
      const cache = new Cache(this.testId, { maxAge: 0 })
      console.log(cache)
    }, Error, '"maxAge" must be greater than zero!')
    assert.throws(() => {
      const cache = new Cache(this.testId, { maxAge: -1 })
      console.log(cache)
    }, Error, '"maxAge" must be greater than zero!')
  })
})
