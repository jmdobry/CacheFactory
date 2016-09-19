import {
  assert
} from '../../_setup'

describe('CacheFactory#exists', function () {
  it('should return whether the cache exists', function () {
    assert.strictEqual(this.cacheFactory.exists(this.testId), false)
    this.cacheFactory.createCache(this.testId)
    assert.strictEqual(this.cacheFactory.exists(this.testId), true)
    this.cacheFactory.destroy(this.testId)
    assert.strictEqual(this.cacheFactory.exists(this.testId), false)
  })
})
