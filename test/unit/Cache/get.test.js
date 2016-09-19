import {
  assert,
  CacheFactory,
  TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER,
  TYPES_EXCEPT_OBJECT,
  TYPES_EXCEPT_FUNCTION
} from '../../_setup'

const { Cache } = CacheFactory

describe('Cache#get', function () {
  it('should do nothing if the cache is disabled', function () {
    const cache = new Cache(this.testId)

    assert.strictEqual(cache.info().size, 0)
    cache.put('1', 'item')
    assert.strictEqual(cache.get('1'), 'item')
    assert.strictEqual(cache.info().size, 1)
    cache.disable()
    assert.strictEqual(cache.info().size, 1)
    assert.strictEqual(cache.get('1'), undefined)
  })

  it('should throw an error if "key" is not a string or array', function () {
    const cache = new Cache(this.testId)
    TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER.forEach((value) => {
      if (value === null || value === undefined) {
        return
      }
      assert.throws(() => {
        cache.get(value)
      }, TypeError, '"key" must be a string!')
    })
  })

  it('should throw an error if "options" is not an object', function () {
    const cache = new Cache(this.testId)
    TYPES_EXCEPT_OBJECT.forEach((value) => {
      if (value === undefined) {
        return
      }
      assert.throws(() => {
        cache.get(this.testId, value)
      }, TypeError, '"options" must be an object!')
    })
  })

  it('should throw an error if "onExpire" is not a function', function () {
    const cache = new Cache(this.testId)
    TYPES_EXCEPT_FUNCTION.forEach((value) => {
      if (!value) {
        return
      }
      assert.throws(() => {
        cache.get(this.testId, {
          onExpire: value
        })
      }, TypeError, '"options.onExpire" must be a function!')
    })
  })

  it('should return the correct value for the specified key.', function () {
    const cache = new Cache(this.testId)
    const value1 = 'value1'
    const value2 = 2
    const value3 = {
      value3: 'stuff'
    }
    cache.put('item1', value1)
    cache.put('item2', value2)
    cache.put('item3', value3)
    assert.strictEqual(cache.get('item1'), value1)
    assert.strictEqual(cache.get('item2'), value2)
    assert.strictEqual(cache.get('item3'), value3)
  })

  it('should return undefined if the key is not in the cache.', function () {
    const cache = new Cache(this.testId)
    assert.strictEqual(cache.get('item'), undefined)
  })

  it('should execute globally configured "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is configured.', function (done) {
    const cache = new Cache(this.testId, {
      maxAge: 10,
      recycleFreq: 20,
      deleteOnExpire: 'passive',
      onExpire: function (key, value, done2) {
        done2(key, value, 'executed global callback')
      }
    })
    cache.put('item', 'value')
    setTimeout(function () {
      cache.get('item', {
        onExpire: function (key, value, test) {
          assert.strictEqual(key, 'item')
          assert.strictEqual(value, 'value')
          assert.strictEqual(test, 'executed global callback')
        }
      })
      done()
    }, 100)
  })

  it('should execute globally configured "onExpire" callback when an item is aggressively deleted and global "onExpire" callback is configured.', function (done) {
    const options = {
      maxAge: 10,
      recycleFreq: 20,
      deleteOnExpire: 'aggressive',
      onExpire: function (key, value) {}
    }
    sinon.spy(options, 'onExpire')
    const cache = new Cache(this.testId, options)
    cache.put('item', 'value')
    setTimeout(function () {
      assert.isTrue(options.onExpire.called)
      assert.isTrue(options.onExpire.calledWith('item', 'value'))
      done()
    }, 100)
  })

  it('should execute local "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is NOT configured.', function (done) {
    const cache = new Cache(this.testId, {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20
    })
    cache.put('item', 'value')
    setTimeout(function () {
      cache.get('item', {
        onExpire: function (key, value) {
          assert.strictEqual(key, 'item')
          assert.strictEqual(value, 'value')
        }
      })
      done()
    }, 100)
  })

  it('should return the correct values for multiple keys.', function () {
    const cache = new Cache(this.testId)
    const value1 = 'value1'
    const value2 = 2
    const value3 = {
      value3: 'stuff'
    }
    cache.put('item1', value1)
    cache.put('item2', value2)
    cache.put('item3', value3)
    assert.deepEqual(cache.get(['item1', 'item2', 'item3']), [value1, value2, value3])
  })

  it('should not return undefined values for multiple keys.', function () {
    const cache = new Cache(this.testId)
    const value1 = 'value1'
    const value2 = 2
    cache.put('item1', value1)
    cache.put('item2', value2)
    assert.deepEqual(cache.get(['item1', 'item2', 'item3']), [value1, value2])
  })
})
