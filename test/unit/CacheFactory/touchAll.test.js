import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#touchAll', function () {
  beforeEach(function () {
    sinon.stub(CacheFactory.Cache.prototype, 'touch')
  })

  afterEach(function () {
    CacheFactory.Cache.prototype.touch.restore()
  })

  it('should call touch on all caches', function () {
    const cache1 = this.cacheFactory.createCache(this.testId + 1)
    const cache2 = this.cacheFactory.createCache(this.testId + 2)
    const cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.touchAll()

    assert.strictEqual(cache1.touch.calledThrice, true)
    assert.strictEqual(cache2.touch.calledThrice, true)
    assert.strictEqual(cache3.touch.calledThrice, true)
  })
})
