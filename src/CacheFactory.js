import defaults from './defaults'
/**
 * A instance of `CacheFactory` holds multiple caches, and provides methods for
 * manipulating all of the caches at once.
 *
 * @example
 * import CacheFactory from 'cachefactory';
 *
 * const cacheFactory = new CacheFactory();
 * const cache = cacheFactory.createCache('my-cache');
 *
 * @class CacheFactory
 */
export default class CacheFactory {
  constructor () {
    Object.defineProperty(this, 'caches', {
      writable: true,
      value: {}
    })
  }

  /**
   * Calls {@link Cache#removeAll} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @example
   * cacheFactory.clearAll();
   *
   * @method CacheFactory#clearAll
   */
  clearAll () {
    this.keys().forEach((cacheId) => {
      this.get(cacheId).removeAll()
    })
  }

  /**
   * Create a new {@link Cache}. If a cache with the same `id` had been created
   * in a previous browser session, then it will attempt to load any data that
   * had been saved previously.
   *
   * @example
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const options = {...};
   * const cache = cacheFactory.createCache('my-cache', options);
   *
   * cache.put('foo', 'bar');
   * console.log(cache.get('foo')); // "bar"
   *
   * @method CacheFactory#createCache
   * @param {string} id A unique identifier for the new {@link Cache}.
   * @param {object} [options] Configuration options. See {@link Cache}.
   * @returns {Cache} The new {@link Cache} instance.
   */
  createCache (id, options = {}) {
    if (this.caches[id]) {
      throw new Error(`cache "${id}" already exists!`)
    }
    options.parent = this
    this.caches[id] = new CacheFactory.Cache(id, options)
    return this.caches[id]
  }

  /**
   * Calls {@link Cache#destroy} on the {@link Cache} in this
   * {@link CacheFactory} that has the specified `id`.
   *
   * @example
   * cacheFactory.destroy('my-cache');
   *
   * @method CacheFactory#destroy
   * @param {string} id TODO
   */
  destroy (id) {
    this.get(id).destroy()
    this.caches[id] = undefined
  }

  /**
   * Calls {@link Cache#destroy} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @example
   * cacheFactory.destroyAll();
   *
   * @method CacheFactory#destroyAll
   */
  destroyAll () {
    this.keys().forEach((id) => {
      this.get(id).destroy()
    })
    this.caches = {}
  }

  /**
   * Calls {@link Cache#disable} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @example
   * cacheFactory.disableAll();
   *
   * @method CacheFactory#disableAll
   */
  disableAll () {
    this.keys().forEach((cacheId) => {
      this.get(cacheId).disable()
    })
  }

  /**
   * Calls {@link Cache#enable} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @example
   * cacheFactory.enableAll();
   *
   * @method CacheFactory#enableAll
   */
  enableAll () {
    this.keys().forEach((cacheId) => {
      this.get(cacheId).enable()
    })
  }

  /**
   * Returns whether the {@link Cache} with the specified `id` exists in this
   * {@link CacheFactory}.
   *
   * @example
   * const exists = cacheFactory.exists('my-cache');
   *
   * @method CacheFactory#exists
   * @returns {boolean} Whether the {@link Cache} with the specified `id` exists
   * in this {@link CacheFactory}.
   */
  exists (id) {
    return !!this.caches[id]
  }

  /**
   * Returns a reference to the {@link Cache} in this {@link CacheFactory} that
   * has the specified `id`.
   *
   * @example
   * const cache = cacheFactory.get('my-cache');
   *
   * @method CacheFactory#get
   * @param {string} id The `id` of the {@link Cache} to retrieve.
   * @returns {Cache} The {@link Cache} instance.
   * @throws {ReferenceError} Throws a `ReferenceError` if the {@link Cache}
   * does not exist.
   */
  get (id) {
    const cache = this.caches[id]
    if (!cache) {
      throw new ReferenceError(`Cache "${id}" does not exist!`)
    }
    return cache
  }

  /**
   * Returns information on this {@link CacheFactory} and its {@link Cache}
   * instance.
   *
   * @example
   * const info = cacheFactory.info();
   * info.size; // 3
   * info.caches['my-cache']; // { size: 1234, ... }
   * info.caches['my-cache2']; // { size: 51, ... }
   * info.caches['my-cache3']; // { size: 43, ... }
   *
   * @method CacheFactory#info
   * @returns {object} The detailed information.
   */
  info () {
    const keys = this.keys()
    const info = {
      size: keys.length,
      caches: {}
    }
    keys.forEach((cacheId) => {
      info.caches[cacheId] = this.get(cacheId).info()
    })
    Object.keys(defaults).forEach((key, value) => {
      info[key] = defaults[key]
    })
    return info
  }

  /**
   * Returns an array of identifiers of the {@link Cache} instances in this
   * {@link CacheFactory}.
   *
   * @example
   * const keys = cacheFactory.keys();
   *
   * @method CacheFactory#keys
   * @returns {string[]} The {@link Cache} identifiers.
   */
  keys () {
    return Object.keys(this.caches).filter((key) => this.caches[key])
  }

  /**
   * Returns an object of key-value pairs representing the identifiers of the
   * {@link Cache} instances in this {@link CacheFactory}.
   *
   * @example
   * const keySet = cacheFactory.keySet();
   *
   * @method CacheFactory#keySet
   * @returns {object} The {@link Cache} identifiers.
   */
  keySet () {
    const set = {}
    this.keys().forEach((key) => {
      set[key] = key
    })
    return set
  }

  /**
   * Calls {@link Cache#removeExpired} on each {@link Cache} in this
   * {@link CacheFactory} and returns the removed items, if any.
   *
   * @example
   * const expired = cacheFactory.removeExpiredFromAll();
   *
   * @method CacheFactory#removeExpiredFromAll
   * @returns {object} The removed items, if any.
   */
  removeExpiredFromAll () {
    const expired = {}
    this.keys().forEach((id) => {
      expired[id] = this.get(id).removeExpired()
    })
    return expired
  }

  /**
   * Calls {@link Cache#touch} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @example
   * cacheFactory.touchAll();
   *
   * @method CacheFactory#touchAll
   */
  touchAll () {
    this.keys().forEach((cacheId) => {
      this.get(cacheId).touch()
    })
  }
}
