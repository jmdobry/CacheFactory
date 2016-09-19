import {
  assert,
  CacheFactory
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#remove', function () {
  it('should remove the item with the specified key.', function () {
    const cache = new Cache(this.testId)
    const value1 = 'value1'
    const value2 = 2
    const value3 = {
      value3: 'stuff'
    }
    cache.put('item1', value1)
    cache.put('item2', value2)
    cache.put('item3', value3)
    cache.remove('item1')
    assert.isUndefined(cache.get('item1'))
    cache.remove('item2')
    assert.isUndefined(cache.get('item2'))
    cache.remove('item3')
    assert.isUndefined(cache.get('item3'))
  })

  it('should reduce the size of the cache by one if the size is greater than zero.', function () {
    const cache = new Cache(this.testId)
    cache.put('item1', 'value1')
    assert.strictEqual(cache.info().size, 1)
    cache.put('item2', 'value2')
    assert.strictEqual(cache.info().size, 2)
    cache.remove('item1')
    assert.strictEqual(cache.info().size, 1)
    cache.remove('item2')
    assert.strictEqual(cache.info().size, 0)
    cache.remove('item1')
    assert.strictEqual(cache.info().size, 0)
    cache.remove('item2')
    assert.strictEqual(cache.info().size, 0)
  })

  it('should remove items from localStorage when storageMode is used.', function () {
    const localStorageCache = new Cache('localStorageCache', { storageMode: 'localStorage' })
    const sessionStorageCache = new Cache('sessionStorageCache', { storageMode: 'sessionStorage' })

    localStorageCache.put('item1', 'value1')

    localStorageCache.put('2', 'value2')
    assert.strictEqual(localStorageCache.keys().length, 2)
    localStorageCache.remove(2)
    assert.strictEqual(localStorageCache.keys().length, 1)

    sessionStorageCache.put('item1', 'value1')

    assert.strictEqual(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1"]')
    assert.strictEqual(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1"]')

    localStorageCache.remove('item1')
    sessionStorageCache.remove('item1')

    assert.isNull(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')))
    assert.strictEqual(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '[]')
    assert.isNull(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')))
    assert.strictEqual(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '[]')
  })
})
