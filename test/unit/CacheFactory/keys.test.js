import {
  assert
} from '../../_setup'

describe('CacheFactory#keys', function () {
  it('should return the set of keys', function () {
    var keys = [this.testId]
    this.cacheFactory.createCache(this.testId)
    assert.deepEqual(this.cacheFactory.keys(), keys)
  })
})
