import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#createCache', function () {
  var fake = {}

  beforeEach(function () {
    sinon.stub(CacheFactory, 'Cache').returns(fake)
  })

  afterEach(function () {
    CacheFactory.Cache.restore()
  })

  it('should create a cache', function () {
    var options = {}
    var cache = this.cacheFactory.createCache(this.testId)

    assert.strictEqual(CacheFactory.Cache.calledOnce, true)
    assert.deepEqual(CacheFactory.Cache.firstCall.args, [this.testId, { parent: this.cacheFactory }])
    assert.strictEqual(cache, fake)
    assert.strictEqual(this.cacheFactory.caches[this.testId], fake)

    var cache2 = this.cacheFactory.createCache(this.testId + 2, options)

    assert.strictEqual(CacheFactory.Cache.calledTwice, true)
    assert.deepEqual(CacheFactory.Cache.secondCall.args, [this.testId + 2, options])
    assert.strictEqual(cache2, fake)
    assert.strictEqual(this.cacheFactory.caches[this.testId + 2], fake)
  })

  it('should prevent a cache from being duplicated.', function () {
    assert.throws(() => {
      this.cacheFactory.createCache(this.testId)
      this.cacheFactory.createCache(this.testId)
    }, Error, 'cache "' + this.testId + '" already exists!')
  })
})
