let BinaryHeap = require('yabh')
let _Promise = null
try {
  _Promise = window.Promise
} catch (e) {}

let utils = {
  isNumber (value) {
    return typeof value === 'number'
  },

  isString (value) {
    return typeof value === 'string'
  },

  isObject (value) {
    return value !== null && typeof value === 'object'
  },

  isFunction (value) {
    return typeof value === 'function'
  },

  fromJson (value) {
    return JSON.parse(value)
  },

  equals (a, b) {
    return a === b
  },

  Promise: _Promise
}

function _keys (collection) {
  const keys = []
  let key
  if (!utils.isObject(collection)) {
    return keys
  }
  for (key in collection) {
    if (collection.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  return keys
}

function _isPromiseLike (value) {
  return value && typeof value.then === 'function'
}

function _stringifyNumber (number) {
  if (utils.isNumber(number)) {
    return number.toString()
  }
  return number
}

function _keySet (collection) {
  const keySet = {}
  let key
  if (!utils.isObject(collection)) {
    return keySet
  }
  for (key in collection) {
    if (collection.hasOwnProperty(key)) {
      keySet[key] = key
    }
  }
  return keySet
}

const defaults = {
  capacity: Number.MAX_VALUE,
  maxAge: Number.MAX_VALUE,
  deleteOnExpire: 'none',
  onExpire: null,
  cacheFlushInterval: null,
  recycleFreq: 1000,
  storageMode: 'memory',
  storageImpl: null,
  disabled: false,
  storagePrefix: 'cachefactory.caches.',
  storeOnResolve: false,
  storeOnReject: false
}

let caches = {}

function createCache (cacheId, options) {
  if (cacheId in caches) {
    throw new Error(`${cacheId} already exists!`)
  } else if (!utils.isString(cacheId)) {
    throw new Error('cacheId must be a string!')
  }

  let $$data = {}
  let $$promises = {}
  let $$storage = null
  let $$expiresHeap = new BinaryHeap(function (x) { return x.expires }, utils.equals)
  let $$lruHeap = new BinaryHeap(function (x) { return x.accessed }, utils.equals)

  let cache = caches[cacheId] = {

    $$id: cacheId,

    destroy () {
      clearInterval(this.$$cacheFlushIntervalId)
      clearInterval(this.$$recycleFreqId)
      this.removeAll()
      if ($$storage) {
        $$storage().removeItem(`${this.$$prefix}.keys`)
        $$storage().removeItem(this.$$prefix)
      }
      $$storage = null
      $$data = null
      $$lruHeap = null
      $$expiresHeap = null
      this.$$prefix = null
      delete caches[this.$$id]
    },

    disable () {
      this.$$disabled = true
    },

    enable () {
      delete this.$$disabled
    },

    get (key, options) {
      if (Array.isArray(key)) {
        let keys = key
        let values = []

        keys.forEach(key => {
          let value = this.get(key, options)
          if (value !== null && value !== undefined) {
            values.push(value)
          }
        })

        return values
      } else {
        key = _stringifyNumber(key)

        if (this.$$disabled) {
          return
        }
      }

      options = options || {}
      if (!utils.isString(key)) {
        throw new Error('key must be a string!')
      } else if (options && !utils.isObject(options)) {
        throw new Error('options must be an object!')
      } else if (options.onExpire && !utils.isFunction(options.onExpire)) {
        throw new Error('options.onExpire must be a function!')
      }

      let item

      if ($$storage) {
        if ($$promises[key]) {
          return $$promises[key]
        }

        let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)

        if (itemJson) {
          item = utils.fromJson(itemJson)
        } else {
          return
        }
      } else if (utils.isObject($$data)) {
        if (!(key in $$data)) {
          return
        }

        item = $$data[key]
      }

      let value = item.value
      let now = new Date().getTime()

      if ($$storage) {
        $$lruHeap.remove({
          key: key,
          accessed: item.accessed
        })
        item.accessed = now
        $$lruHeap.push({
          key: key,
          accessed: now
        })
      } else {
        $$lruHeap.remove(item)
        item.accessed = now
        $$lruHeap.push(item)
      }

      if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
        this.remove(key)

        if (this.$$onExpire) {
          this.$$onExpire(key, item.value, options.onExpire)
        } else if (options.onExpire) {
          options.onExpire.call(this, key, item.value)
        }
        value = undefined
      } else if ($$storage) {
        $$storage().setItem(`${this.$$prefix}.data.${key}`, JSON.stringify(item))
      }

      return value
    },

    info (key) {
      if (key) {
        let item
        if ($$storage) {
          let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)

          if (itemJson) {
            item = utils.fromJson(itemJson)
            return {
              created: item.created,
              accessed: item.accessed,
              expires: item.expires,
              isExpired: (new Date().getTime() - item.created) > (item.maxAge || this.$$maxAge)
            }
          } else {
            return undefined
          }
        } else if (utils.isObject($$data) && key in $$data) {
          item = $$data[key]

          return {
            created: item.created,
            accessed: item.accessed,
            expires: item.expires,
            isExpired: (new Date().getTime() - item.created) > (item.maxAge || this.$$maxAge)
          }
        } else {
          return undefined
        }
      } else {
        return {
          id: this.$$id,
          capacity: this.$$capacity,
          maxAge: this.$$maxAge,
          deleteOnExpire: this.$$deleteOnExpire,
          onExpire: this.$$onExpire,
          cacheFlushInterval: this.$$cacheFlushInterval,
          recycleFreq: this.$$recycleFreq,
          storageMode: this.$$storageMode,
          storageImpl: $$storage ? $$storage() : undefined,
          disabled: !!this.$$disabled,
          size: $$lruHeap && $$lruHeap.size() || 0
        }
      }
    },

    keys () {
      if ($$storage) {
        let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)

        if (keysJson) {
          return utils.fromJson(keysJson)
        } else {
          return []
        }
      } else {
        return _keys($$data)
      }
    },

    keySet () {
      if ($$storage) {
        let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)
        let kSet = {}

        if (keysJson) {
          let keys = utils.fromJson(keysJson)

          for (var i = 0; i < keys.length; i++) {
            kSet[keys[i]] = keys[i]
          }
        }
        return kSet
      } else {
        return _keySet($$data)
      }
    },

    put (key, value, options) {
      options || (options = {})

      let storeOnResolve = 'storeOnResolve' in options ? !!options.storeOnResolve : this.$$storeOnResolve
      let storeOnReject = 'storeOnReject' in options ? !!options.storeOnReject : this.$$storeOnReject

      let getHandler = (store, isError) => {
        return v => {
          if (store) {
            delete $$promises[key]
            if (utils.isObject(v) && 'status' in v && 'data' in v) {
              v = [v.status, v.data, v.headers(), v.statusText]
              this.put(key, v)
            } else {
              this.put(key, v)
            }
          }
          if (isError) {
            if (utils.Promise) {
              return utils.Promise.reject(v)
            } else {
              throw v
            }
          } else {
            return v
          }
        }
      }

      if (this.$$disabled || !utils.isObject($$data) || value === null || value === undefined) {
        return
      }
      key = _stringifyNumber(key)

      if (!utils.isString(key)) {
        throw new Error('key must be a string!')
      }

      let now = new Date().getTime()
      let item = {
        key: key,
        value: _isPromiseLike(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value,
        created: options.created === undefined ? now : options.created,
        accessed: options.accessed === undefined ? now : options.accessed
      }
      if (options.maxAge) {
        item.maxAge = options.maxAge
      }

      if (options.expires === undefined) {
        item.expires = item.created + (item.maxAge || this.$$maxAge)
      } else {
        item.expires = options.expires
      }

      if ($$storage) {
        if (_isPromiseLike(item.value)) {
          $$promises[key] = item.value
          return $$promises[key]
        }
        let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)
        let keys = keysJson ? utils.fromJson(keysJson) : []
        let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)

        // Remove existing
        if (itemJson) {
          this.remove(key)
        }
        // Add to expires heap
        $$expiresHeap.push({
          key: key,
          expires: item.expires
        })
        // Add to lru heap
        $$lruHeap.push({
          key: key,
          accessed: item.accessed
        })
        // Set item
        $$storage().setItem(`${this.$$prefix}.data.${key}`, JSON.stringify(item))
        let exists = false
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === key) {
            exists = true
            break
          }
        }
        if (!exists) {
          keys.push(key)
        }
        $$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify(keys))
      } else {
        // Remove existing
        if ($$data[key]) {
          this.remove(key)
        }
        // Add to expires heap
        $$expiresHeap.push(item)
        // Add to lru heap
        $$lruHeap.push(item)
        // Set item
        $$data[key] = item
        delete $$promises[key]
      }

      // Handle exceeded capacity
      if ($$lruHeap.size() > this.$$capacity) {
        this.remove($$lruHeap.peek().key)
      }

      return value
    },

    remove (key) {
      key += ''
      delete $$promises[key]
      if ($$storage) {
        let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)

        if (itemJson) {
          let item = utils.fromJson(itemJson)
          $$lruHeap.remove({
            key: key,
            accessed: item.accessed
          })
          $$expiresHeap.remove({
            key: key,
            expires: item.expires
          })
          $$storage().removeItem(`${this.$$prefix}.data.${key}`)
          let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)
          let keys = keysJson ? utils.fromJson(keysJson) : []
          let index = keys.indexOf(key)

          if (index >= 0) {
            keys.splice(index, 1)
          }
          $$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify(keys))
          return item.value
        }
      } else if (utils.isObject($$data)) {
        let value = $$data[key] ? $$data[key].value : undefined
        $$lruHeap.remove($$data[key])
        $$expiresHeap.remove($$data[key])
        $$data[key] = null
        delete $$data[key]
        return value
      }
    },

    removeAll () {
      if ($$storage) {
        $$lruHeap.removeAll()
        $$expiresHeap.removeAll()
        let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)

        if (keysJson) {
          let keys = utils.fromJson(keysJson)

          for (var i = 0; i < keys.length; i++) {
            this.remove(keys[i])
          }
        }
        $$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify([]))
      } else if (utils.isObject($$data)) {
        $$lruHeap.removeAll()
        $$expiresHeap.removeAll()
        for (var key in $$data) {
          $$data[key] = null
        }
        $$data = {}
      } else {
        $$lruHeap.removeAll()
        $$expiresHeap.removeAll()
        $$data = {}
      }
      $$promises = {}
    },

    removeExpired () {
      let now = new Date().getTime()
      let expired = {}
      let key
      let expiredItem

      while ((expiredItem = $$expiresHeap.peek()) && expiredItem.expires <= now) {
        expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null
        $$expiresHeap.pop()
      }

      if ($$storage) {
        for (key in expired) {
          let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)
          if (itemJson) {
            expired[key] = utils.fromJson(itemJson).value
            this.remove(key)
          }
        }
      } else {
        for (key in expired) {
          this.remove(key)
        }
      }

      if (this.$$onExpire) {
        for (key in expired) {
          this.$$onExpire(key, expired[key])
        }
      }

      return expired
    },

    setCacheFlushInterval (cacheFlushInterval) {
      const _this = this
      if (cacheFlushInterval === null) {
        delete _this.$$cacheFlushInterval
      } else if (!utils.isNumber(cacheFlushInterval)) {
        throw new Error('cacheFlushInterval must be a number!')
      } else if (cacheFlushInterval < 0) {
        throw new Error('cacheFlushInterval must be greater than zero!')
      } else if (cacheFlushInterval !== _this.$$cacheFlushInterval) {
        _this.$$cacheFlushInterval = cacheFlushInterval

        clearInterval(_this.$$cacheFlushIntervalId) // eslint-disable-line

        _this.$$cacheFlushIntervalId = setInterval(function () {
          _this.removeAll()
        }, _this.$$cacheFlushInterval)
      }
    },

    setCapacity (capacity) {
      if (capacity === null) {
        delete this.$$capacity
      } else if (!utils.isNumber(capacity)) {
        throw new Error('capacity must be a number!')
      } else if (capacity < 0) {
        throw new Error('capacity must be greater than zero!')
      } else {
        this.$$capacity = capacity
      }
      let removed = {}
      while ($$lruHeap.size() > this.$$capacity) {
        removed[$$lruHeap.peek().key] = this.remove($$lruHeap.peek().key)
      }
      return removed
    },

    setDeleteOnExpire (deleteOnExpire, setRecycleFreq) {
      if (deleteOnExpire === null) {
        delete this.$$deleteOnExpire
      } else if (!utils.isString(deleteOnExpire)) {
        throw new Error('deleteOnExpire must be a string!')
      } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
        throw new Error('deleteOnExpire must be "none", "passive" or "aggressive"!')
      } else {
        this.$$deleteOnExpire = deleteOnExpire
      }
      if (setRecycleFreq !== false) {
        this.setRecycleFreq(this.$$recycleFreq)
      }
    },

    setMaxAge (maxAge) {
      if (maxAge === null) {
        this.$$maxAge = Number.MAX_VALUE
      } else if (!utils.isNumber(maxAge)) {
        throw new Error('maxAge must be a number!')
      } else if (maxAge < 0) {
        throw new Error('maxAge must be greater than zero!')
      } else {
        this.$$maxAge = maxAge
      }
      let i, keys, key

      $$expiresHeap.removeAll()

      if ($$storage) {
        let keysJson = $$storage().getItem(`${this.$$prefix}.keys`)

        keys = keysJson ? utils.fromJson(keysJson) : []

        for (i = 0; i < keys.length; i++) {
          key = keys[i]
          let itemJson = $$storage().getItem(`${this.$$prefix}.data.${key}`)

          if (itemJson) {
            let item = utils.fromJson(itemJson)
            if (this.$$maxAge === Number.MAX_VALUE) {
              item.expires = Number.MAX_VALUE
            } else {
              item.expires = item.created + (item.maxAge || this.$$maxAge)
            }
            $$expiresHeap.push({
              key: key,
              expires: item.expires
            })
          }
        }
      } else {
        keys = _keys($$data)

        for (i = 0; i < keys.length; i++) {
          key = keys[i]
          if (this.$$maxAge === Number.MAX_VALUE) {
            $$data[key].expires = Number.MAX_VALUE
          } else {
            $$data[key].expires = $$data[key].created + ($$data[key].maxAge || this.$$maxAge)
          }
          $$expiresHeap.push($$data[key])
        }
      }
      if (this.$$deleteOnExpire === 'aggressive') {
        return this.removeExpired()
      } else {
        return {}
      }
    },

    setOnExpire (onExpire) {
      if (onExpire === null) {
        delete this.$$onExpire
      } else if (!utils.isFunction(onExpire)) {
        throw new Error('onExpire must be a function!')
      } else {
        this.$$onExpire = onExpire
      }
    },

    setOptions (cacheOptions, strict) {
      cacheOptions = cacheOptions || {}
      strict = !!strict
      if (!utils.isObject(cacheOptions)) {
        throw new Error('cacheOptions must be an object!')
      }

      if ('storagePrefix' in cacheOptions) {
        this.$$storagePrefix = cacheOptions.storagePrefix
      } else if (strict) {
        this.$$storagePrefix = defaults.storagePrefix
      }

      this.$$prefix = this.$$storagePrefix + this.$$id

      if ('disabled' in cacheOptions) {
        this.$$disabled = !!cacheOptions.disabled
      } else if (strict) {
        this.$$disabled = defaults.disabled
      }

      if ('deleteOnExpire' in cacheOptions) {
        this.setDeleteOnExpire(cacheOptions.deleteOnExpire, false)
      } else if (strict) {
        this.setDeleteOnExpire(defaults.deleteOnExpire, false)
      }

      if ('recycleFreq' in cacheOptions) {
        this.setRecycleFreq(cacheOptions.recycleFreq)
      } else if (strict) {
        this.setRecycleFreq(defaults.recycleFreq)
      }

      if ('maxAge' in cacheOptions) {
        this.setMaxAge(cacheOptions.maxAge)
      } else if (strict) {
        this.setMaxAge(defaults.maxAge)
      }

      if ('storeOnResolve' in cacheOptions) {
        this.$$storeOnResolve = !!cacheOptions.storeOnResolve
      } else if (strict) {
        this.$$storeOnResolve = defaults.storeOnResolve
      }

      if ('storeOnReject' in cacheOptions) {
        this.$$storeOnReject = !!cacheOptions.storeOnReject
      } else if (strict) {
        this.$$storeOnReject = defaults.storeOnReject
      }

      if ('capacity' in cacheOptions) {
        this.setCapacity(cacheOptions.capacity)
      } else if (strict) {
        this.setCapacity(defaults.capacity)
      }

      if ('cacheFlushInterval' in cacheOptions) {
        this.setCacheFlushInterval(cacheOptions.cacheFlushInterval)
      } else if (strict) {
        this.setCacheFlushInterval(defaults.cacheFlushInterval)
      }

      if ('onExpire' in cacheOptions) {
        this.setOnExpire(cacheOptions.onExpire)
      } else if (strict) {
        this.setOnExpire(defaults.onExpire)
      }

      if ('storageMode' in cacheOptions || 'storageImpl' in cacheOptions) {
        this.setStorageMode(cacheOptions.storageMode || defaults.storageMode, cacheOptions.storageImpl || defaults.storageImpl)
      } else if (strict) {
        this.setStorageMode(defaults.storageMode, defaults.storageImpl)
      }
    },

    setRecycleFreq (recycleFreq) {
      if (recycleFreq === null) {
        delete this.$$recycleFreq
      } else if (!utils.isNumber(recycleFreq)) {
        throw new Error('recycleFreq must be a number!')
      } else if (recycleFreq < 0) {
        throw new Error('recycleFreq must be greater than zero!')
      } else {
        this.$$recycleFreq = recycleFreq
      }
      clearInterval(this.$$recycleFreqId)
      if (this.$$deleteOnExpire === 'aggressive') {
        (function (self) {
          self.$$recycleFreqId = setInterval(function () {
            self.removeExpired()
          }, self.$$recycleFreq)
        })(this)
      } else {
        delete this.$$recycleFreqId
      }
    },

    setStorageMode (storageMode, storageImpl) {
      if (!utils.isString(storageMode)) {
        throw new Error('storageMode must be a string!')
      } else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
        throw new Error('storageMode must be "memory", "localStorage" or "sessionStorage"!')
      }

      const prevStorage = $$storage
      const prevData = $$data
      let shouldReInsert = false
      let items = {}

      function load (prevStorage, prevData) {
        const keys = this.keys()
        const length = keys.length
        if (length) {
          let key
          const prevDataIsObject = utils.isObject(prevData)
          for (var i = 0; i < length; i++) {
            key = keys[i]
            if (prevStorage) {
              const itemJson = prevStorage().getItem(`${this.$$prefix}.data.${key}`)
              if (itemJson) {
                items[key] = utils.fromJson(itemJson)
              }
            } else if (prevDataIsObject) {
              items[key] = prevData[key]
            }
            this.remove(key)
          }
          shouldReInsert = true
        }
      }

      if (!this.$$initializing) {
        load.call(this, prevStorage, prevData)
      }

      this.$$storageMode = storageMode

      if (storageImpl) {
        if (!utils.isObject(storageImpl)) {
          throw new Error('storageImpl must be an object!')
        } else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
          throw new Error('storageImpl must implement "setItem(key, value)"!')
        } else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
          throw new Error('storageImpl must implement "getItem(key)"!')
        } else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
          throw new Error('storageImpl must implement "removeItem(key)"!')
        }
        $$storage = () => storageImpl
      } else if (this.$$storageMode === 'localStorage') {
        try {
          localStorage.setItem('cachefactory', 'cachefactory')
          localStorage.removeItem('cachefactory')
          $$storage = () => localStorage
        } catch (e) {
          $$storage = null
          this.$$storageMode = 'memory'
        }
      } else if (this.$$storageMode === 'sessionStorage') {
        try {
          sessionStorage.setItem('cachefactory', 'cachefactory')
          sessionStorage.removeItem('cachefactory')
          $$storage = () => sessionStorage
        } catch (e) {
          $$storage = null
          this.$$storageMode = 'memory'
        }
      } else {
        $$storage = null
        this.$$storageMode = 'memory'
      }

      if (this.$$initializing) {
        load.call(this, $$storage, $$data)
      }

      if (shouldReInsert) {
        let item
        for (var key in items) {
          item = items[key]
          this.put(key, item.value, {
            created: item.created,
            accessed: item.accessed,
            expires: item.expires
          })
        }
      }
    },

    touch (key, options) {
      if (key) {
        let val = this.get(key, {
          onExpire: (k, v) => this.put(k, v)
        })
        if (val) {
          this.put(key, val, options)
        }
      } else {
        let keys = this.keys()
        for (var i = 0; i < keys.length; i++) {
          this.touch(keys[i], options)
        }
      }
    },

    values () {
      const keys = this.keys()
      const items = []
      for (var i = 0; i < keys.length; i++) {
        items.push(this.get(keys[i]))
      }
      return items
    }
  }

  cache.$$initializing = true
  cache.setOptions(options, true)
  cache.$$initializing = false

  return cache
}

function CacheFactory (cacheId, options) {
  return createCache(cacheId, options)
}

CacheFactory.createCache = createCache
CacheFactory.defaults = defaults

CacheFactory.info = function () {
  const keys = _keys(caches)
  const info = {
    size: keys.length,
    caches: {}
  }
  for (var opt in defaults) {
    if (defaults.hasOwnProperty(opt)) {
      info[opt] = defaults[opt]
    }
  }
  for (var i = 0; i < keys.length; i++) {
    let key = keys[i]
    info.caches[key] = caches[key].info()
  }
  return info
}

CacheFactory.get = function (cacheId) { return caches[cacheId] }
CacheFactory.keySet = function () { return _keySet(caches) }
CacheFactory.keys = function () { return _keys(caches) }
CacheFactory.destroy = function (cacheId) {
  if (caches[cacheId]) {
    caches[cacheId].destroy()
    delete caches[cacheId]
  }
}
CacheFactory.destroyAll = function () {
  for (var cacheId in caches) {
    caches[cacheId].destroy()
  }
  caches = {}
}
CacheFactory.clearAll = function () {
  for (var cacheId in caches) {
    caches[cacheId].removeAll()
  }
}
CacheFactory.removeExpiredFromAll = function () {
  const expired = {}
  for (var cacheId in caches) {
    expired[cacheId] = caches[cacheId].removeExpired()
  }
  return expired
}
CacheFactory.enableAll = function () {
  for (var cacheId in caches) {
    caches[cacheId].$$disabled = false
  }
}
CacheFactory.disableAll = function () {
  for (var cacheId in caches) {
    caches[cacheId].$$disabled = true
  }
}
CacheFactory.touchAll = function () {
  for (var cacheId in caches) {
    caches[cacheId].touch()
  }
}

CacheFactory.utils = utils
CacheFactory.BinaryHeap = BinaryHeap

module.exports = CacheFactory
