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
    var cache1 = this.cacheFactory.createCache(this.testId + 1)
    var cache2 = this.cacheFactory.createCache(this.testId + 2)
    var cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.destroyAll()

    assert.strictEqual(cache1.destroy.calledThrice, true)
    assert.strictEqual(cache2.destroy.calledThrice, true)
    assert.strictEqual(cache3.destroy.calledThrice, true)
    assert.deepEqual(this.cacheFactory.caches, {})
  })
})
