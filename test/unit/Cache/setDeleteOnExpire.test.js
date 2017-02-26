import {
  assert,
  Cache,
  TYPES_EXCEPT_STRING
} from '../../_setup'

describe('Cache#setDeleteOnExpire', function () {
  it('should set deleteOnExpire', function () {
    const cache = new Cache(this.testId)
    cache.setDeleteOnExpire('passive')
    assert.strictEqual(cache.deleteOnExpire, 'passive')
  })

  it('should reset deleteOnExpire', function () {
    const cache = new Cache(this.testId)
    cache.setDeleteOnExpire(null)
    assert.strictEqual(cache.deleteOnExpire, 'none')
  })

  it('should throw a TypeError if deleteOnExpire is not a string', function () {
    TYPES_EXCEPT_STRING.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        const cache = new Cache(this.testId, { deleteOnExpire: value })
        console.log(cache)
      }, TypeError, '"deleteOnExpire" must be a string!')
    })
  })

  it('should throw an Error if deleteOnExpire is not an allowed value', function () {
    assert.throws(() => {
      const cache = new Cache(this.testId, { deleteOnExpire: 'foo' })
      console.log(cache)
    }, Error, '"deleteOnExpire" must be "none", "passive" or "aggressive"!')
  })
})
