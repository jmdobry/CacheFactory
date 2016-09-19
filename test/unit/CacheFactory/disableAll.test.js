import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#disableAll', function () {
  beforeEach(function () {
    sinon.stub(CacheFactory.Cache.prototype, 'disable')
  })

  afterEach(function () {
    CacheFactory.Cache.prototype.disable.restore()
  })

  it('should call disable on all caches', function () {
    var cache1 = this.cacheFactory.createCache(this.testId + 1)
    var cache2 = this.cacheFactory.createCache(this.testId + 2)
    var cache3 = this.cacheFactory.createCache(this.testId + 3)

    this.cacheFactory.disableAll()

    assert.strictEqual(cache1.disable.calledThrice, true)
    assert.strictEqual(cache2.disable.calledThrice, true)
    assert.strictEqual(cache3.disable.calledThrice, true)
  })
})
