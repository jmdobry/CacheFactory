import {
  assert,
  Cache
} from '../../_setup'

describe('Cache#removeAll', function () {
  it('should remove all items in the cache.', function () {
    const cache = new Cache('DSCache.removeAll.cache')
    const value1 = 'value1'
    const value2 = 2
    const value3 = {
      value3: 'stuff'
    }
    cache.put('item1', value1)
    cache.put('item2', value2)
    cache.put('item3', value3)
    cache.removeAll()
    assert.isUndefined(cache.get('item1'))
    assert.isUndefined(cache.get('item2'))
    assert.isUndefined(cache.get('item3'))
  })

  it('should remove items from localStorage when storageMode is used.', function () {
    const localStorageCache = new Cache('DSCache.removeAll.localStorageCache', { storageMode: 'localStorage', storageImpl: localStorage })
    const sessionStorageCache = new Cache('DSCache.removeAll.sessionStorageCache', { storageMode: 'sessionStorage', storageImpl: sessionStorage, storagePrefix: 'affas' })

    localStorageCache.put('item1', 'value1')
    sessionStorageCache.put('item1', 'value1')
    localStorageCache.put('item2', 'value2')
    sessionStorageCache.put('item2', 'value2')

    assert.strictEqual(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item2')).value, 'value2')
    assert.strictEqual(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.keys'), '["item1","item2"]')
    assert.strictEqual(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item1')).value, 'value1')
    assert.strictEqual(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item2')).value, 'value2')
    assert.strictEqual(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.keys'), '["item1","item2"]')

    localStorageCache.removeAll()
    sessionStorageCache.removeAll()

    assert.isNull(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item1')))
    assert.isNull(JSON.parse(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item2')))
    assert.strictEqual(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.keys'), '[]')
    assert.isNull(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item1')))
    assert.isNull(JSON.parse(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item2')))
    assert.strictEqual(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.keys'), '[]')
  })
})
