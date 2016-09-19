import {
  assert,
  CacheFactory
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#enable', function () {
  it('should enable the cache', function () {
    const cache = new Cache(this.testId, {
      enabled: false
    })
    assert.strictEqual(cache.$$enabled, false)
    cache.enable()
    assert.strictEqual(cache.$$enabled, true)
  })
})
