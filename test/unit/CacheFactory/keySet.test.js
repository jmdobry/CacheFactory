import {
  assert
} from '../../_setup'

describe('CacheFactory#keySet', function () {
  it('should return the set of keys', function () {
    var set = {}
    set[this.testId] = this.testId
    this.cacheFactory.createCache(this.testId)
    assert.deepEqual(this.cacheFactory.keySet(), set)
  })
})
