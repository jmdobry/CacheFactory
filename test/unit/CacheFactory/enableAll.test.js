import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#enableAll', function () {
  beforeEach(function () {
    sinon.stub(CacheFactory.Cache.prototype, 'enable')
  })

  afterEach(function () {
    CacheFactory.Cache.prototype.enable.restore()
  })

  it('should call enable on all caches', function () {
    var cache1 = this.cacheFactory.createCache(this.testId + 1)
    var cache2 = this.cacheFactory.createCache(this.testId + 2)
    var cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.enableAll()

    assert.strictEqual(cache1.enable.calledThrice, true)
    assert.strictEqual(cache2.enable.calledThrice, true)
    assert.strictEqual(cache3.enable.calledThrice, true)
  })
})
