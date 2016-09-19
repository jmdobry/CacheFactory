import {
  assert,
  CacheFactory
} from '../../_setup'

describe('CacheFactory#removeExpiredFromAll', function () {
  beforeEach(function () {
    sinon.stub(CacheFactory.Cache.prototype, 'removeExpired').returns({})
  })

  afterEach(function () {
    CacheFactory.Cache.prototype.removeExpired.restore()
  })

  it('should call removeExpired on all caches', function () {
    const expected = {}
    expected[this.testId + 1] = {}
    expected[this.testId + 2] = {}
    expected[this.testId + 3] = {}

    const cache1 = this.cacheFactory.createCache(this.testId + 1)
    const cache2 = this.cacheFactory.createCache(this.testId + 2)
    const cache3 = this.cacheFactory.createCache(this.testId + 3)

    const expired = this.cacheFactory.removeExpiredFromAll()

    assert.deepEqual(expired, expected)
    assert.strictEqual(cache1.removeExpired.calledThrice, true)
    assert.strictEqual(cache2.removeExpired.calledThrice, true)
    assert.strictEqual(cache3.removeExpired.calledThrice, true)
  })
})
