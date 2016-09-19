import {
  assert,
  CacheFactory
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#disable', function () {
  it('should disable the cache', function () {
    const cache = new Cache(this.testId)
    cache.disable()
    assert.strictEqual(cache.$$enabled, false)
  })
})
