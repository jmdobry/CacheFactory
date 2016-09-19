import {
  assert,
  CacheFactory
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#keys', function () {
  it('should return the array of keys of all items in the cache.', function () {
    const itemKeys = ['item1', 'item2', 'item3']

    const cache = new Cache(this.testId)

    cache.put(itemKeys[0], itemKeys[0])
    assert.deepEqual(cache.keys(), [itemKeys[0]])

    cache.put(itemKeys[0], itemKeys[2])
    assert.deepEqual(cache.keys(), [itemKeys[0]])
    assert.deepEqual(cache.get(itemKeys[0]), itemKeys[2])

    cache.put(itemKeys[1], itemKeys[1])
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1]])

    cache.put(itemKeys[2], itemKeys[2])
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1], itemKeys[2]])

    let keys = cache.keys()

    assert.strictEqual(keys[0], itemKeys[0])
    assert.strictEqual(keys[1], itemKeys[1])
    assert.strictEqual(keys[2], itemKeys[2])

    cache.remove(itemKeys[0])
    cache.remove(itemKeys[1])
    cache.remove(itemKeys[2])

    keys = cache.keys()

    assert.deepEqual(keys, [])
  })

  it('should return the array of keys of all items in the cache when using localStorage.', function () {
    const itemKeys = ['item1', 'item2', 'item3']

    const cache = new Cache(this.testId, {
      storageMode: 'localStorage'
    })

    cache.put(itemKeys[0], itemKeys[0])
    assert.deepEqual(cache.keys(), [itemKeys[0]])

    cache.put(itemKeys[0], itemKeys[2])
    assert.deepEqual(cache.keys(), [itemKeys[0]])
    assert.deepEqual(cache.get(itemKeys[0]), itemKeys[2])

    cache.put(itemKeys[1], itemKeys[1])
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1]])

    cache.put(itemKeys[2], itemKeys[2])
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1], itemKeys[2]])

    let keys = cache.keys()

    assert.strictEqual(keys[0], itemKeys[0])
    assert.strictEqual(keys[1], itemKeys[1])
    assert.strictEqual(keys[2], itemKeys[2])

    cache.remove(itemKeys[0])
    cache.remove(itemKeys[1])
    cache.remove(itemKeys[2])

    keys = cache.keys()

    assert.strictEqual(keys.length, 0)
    assert.deepEqual(keys, [])
  })
})
