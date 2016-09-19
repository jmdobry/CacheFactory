import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#destroyAll', function () {
  beforeEach(function () {
    sinon.stub(CacheFactory.Cache.prototype, 'destroy')
  })

  afterEach(function () {
    CacheFactory.Cache.prototype.destroy.restore()
  })

  it('should call destroy on all caches', function () {
    const cache1 = this.cacheFactory.createCache(this.testId + 1)
    const cache2 = this.cacheFactory.createCache(this.testId + 2)
    const cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.destroy(this.testId + 1)

    assert.strictEqual(cache1.destroy.calledOnce, true)
    assert.strictEqual(cache2.destroy.calledOnce, true)
    assert.strictEqual(cache3.destroy.calledOnce, true)
    assert.strictEqual(this.cacheFactory.caches[this.testId + 1], undefined)

    this.cacheFactory.destroy(this.testId + 2)

    assert.strictEqual(cache1.destroy.calledTwice, true)
    assert.strictEqual(cache2.destroy.calledTwice, true)
    assert.strictEqual(cache3.destroy.calledTwice, true)
    assert.strictEqual(this.cacheFactory.caches[this.testId + 2], undefined)

    this.cacheFactory.destroy(this.testId + 3)

    assert.strictEqual(cache1.destroy.calledThrice, true)
    assert.strictEqual(cache2.destroy.calledThrice, true)
    assert.strictEqual(cache3.destroy.calledThrice, true)
    assert.strictEqual(this.cacheFactory.caches[this.testId + 3], undefined)
  })
})
