import {
  assert,
  Cache
} from '../../_setup'

describe('CacheFactory#clearAll', function () {
  beforeEach(function () {
    sinon.stub(Cache.prototype, 'removeAll')
  })

  afterEach(function () {
    Cache.prototype.removeAll.restore()
  })

  it('should call removeAll on all caches', function () {
    const cache1 = this.cacheFactory.createCache(this.testId + 1)
    const cache2 = this.cacheFactory.createCache(this.testId + 2)
    const cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.clearAll()

    assert.strictEqual(cache1.removeAll.calledThrice, true)
    assert.strictEqual(cache2.removeAll.calledThrice, true)
    assert.strictEqual(cache3.removeAll.calledThrice, true)
  })
})
