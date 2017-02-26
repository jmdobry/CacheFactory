import {
  assert,
  Cache
} from '../../_setup'

describe('Cache#destroy', function () {
  it('should destroy the cache', function () {
    const mock = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    }
    const cache = new Cache(this.testId, {
      storageMode: 'localStorage',
      storageImpl: mock
    })
    sinon.stub(cache, 'removeAll')

    cache.destroy()

    assert.strictEqual(cache.removeAll.calledOnce, true)
    assert.strictEqual(mock.removeItem.calledTwice, true)
    assert.strictEqual(cache.$$storage, null)
    assert.strictEqual(cache.$$data, null)
    assert.strictEqual(cache.$$lruHeap, null)
    assert.strictEqual(cache.$$expiresHeap, null)
    assert.equal(cache.$$pefix, null)
  })
})
