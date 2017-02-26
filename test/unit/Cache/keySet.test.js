import {
  assert,
  Cache
} from '../../_setup'

describe('Cache#keySet', function () {
  it('should return the set of keys of all items in the cache.', function () {
    const itemKeys = ['item1', 'item2', 'item3']

    const cache = new Cache(this.testId)

    cache.put(itemKeys[0], itemKeys[0])
    cache.put(itemKeys[1], itemKeys[1])
    cache.put(itemKeys[2], itemKeys[2])

    let keySet = cache.keySet()

    assert.strictEqual(keySet.hasOwnProperty(itemKeys[0]), true)
    assert.strictEqual(keySet.hasOwnProperty(itemKeys[1]), true)
    assert.strictEqual(keySet.hasOwnProperty(itemKeys[2]), true)

    assert.strictEqual(keySet[itemKeys[0]], itemKeys[0])
    assert.strictEqual(keySet[itemKeys[1]], itemKeys[1])
    assert.strictEqual(keySet[itemKeys[2]], itemKeys[2])

    cache.remove(itemKeys[0])
    cache.remove(itemKeys[1])
    cache.remove(itemKeys[2])

    keySet = cache.keySet()

    assert.strictEqual(keySet.hasOwnProperty(itemKeys[0]), false)
    assert.strictEqual(keySet.hasOwnProperty(itemKeys[1]), false)
    assert.strictEqual(keySet.hasOwnProperty(itemKeys[2]), false)
  })
})
