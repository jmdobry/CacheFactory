import {
  assert
} from '../../_setup'

describe('CacheFactory#get', function () {
  it('should throw a ReferenceError if the cache does not exist', function () {
    assert.throws(() => {
      this.cacheFactory.get(this.testId)
    }, ReferenceError, 'Cache "' + this.testId + '" does not exist!')
  })

  it('should return the specified cache', function () {
    const cache = this.cacheFactory.createCache(this.testId)
    assert.strictEqual(cache, this.cacheFactory.get(this.testId))
  })
})
