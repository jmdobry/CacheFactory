import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory', function () {
  it('should construct an instance of CacheFactory', () => {
    const cacheFactory = new CacheFactory()
    assert.strictEqual(cacheFactory instanceof CacheFactory, true)
  })
})
