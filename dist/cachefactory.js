/**
 * CacheFactory
 * @version 2.0.0 - Homepage <https://github.com/jmdobry/CacheFactory>
 * @copyright (c) 2013-2016 CacheFactory project authors
 * @license MIT <https://github.com/jmdobry/CacheFactory/blob/master/LICENSE>
 * @overview CacheFactory is a very simple and useful cache for the browser.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('cachefactory', factory) :
  (global.CacheFactory = factory());
}(this, (function () { 'use strict';

/**
 * @method bubbleUp
 * @param {array} heap The heap.
 * @param {function} weightFunc The weight function.
 * @param {number} n The index of the element to bubble up.
 */
var bubbleUp = function bubbleUp(heap, weightFunc, n) {
  var element = heap[n];
  var weight = weightFunc(element);
  // When at 0, an element can not go up any further.
  while (n > 0) {
    // Compute the parent element's index, and fetch it.
    var parentN = Math.floor((n + 1) / 2) - 1;
    var parent = heap[parentN];
    // If the parent has a lesser weight, things are in order and we
    // are done.
    if (weight >= weightFunc(parent)) {
      break;
    } else {
      heap[parentN] = element;
      heap[n] = parent;
      n = parentN;
    }
  }
};

/**
 * @method bubbleDown
 * @param {array} heap The heap.
 * @param {function} weightFunc The weight function.
 * @param {number} n The index of the element to sink down.
 */
var bubbleDown = function bubbleDown(heap, weightFunc, n) {
  var length = heap.length;
  var node = heap[n];
  var nodeWeight = weightFunc(node);

  while (true) {
    var child2N = (n + 1) * 2;
    var child1N = child2N - 1;
    var swap = null;
    if (child1N < length) {
      var child1 = heap[child1N];
      var child1Weight = weightFunc(child1);
      // If the score is less than our node's, we need to swap.
      if (child1Weight < nodeWeight) {
        swap = child1N;
      }
    }
    // Do the same checks for the other child.
    if (child2N < length) {
      var child2 = heap[child2N];
      var child2Weight = weightFunc(child2);
      if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
        swap = child2N;
      }
    }

    if (swap === null) {
      break;
    } else {
      heap[n] = heap[swap];
      heap[swap] = node;
      n = swap;
    }
  }
};

function BinaryHeap(weightFunc, compareFunc) {
  if (!weightFunc) {
    weightFunc = function weightFunc(x) {
      return x;
    };
  }
  if (!compareFunc) {
    compareFunc = function compareFunc(x, y) {
      return x === y;
    };
  }
  if (typeof weightFunc !== 'function') {
    throw new Error('BinaryHeap([weightFunc][, compareFunc]): "weightFunc" must be a function!');
  }
  if (typeof compareFunc !== 'function') {
    throw new Error('BinaryHeap([weightFunc][, compareFunc]): "compareFunc" must be a function!');
  }
  this.weightFunc = weightFunc;
  this.compareFunc = compareFunc;
  this.heap = [];
}

var BHProto = BinaryHeap.prototype;

BHProto.push = function (node) {
  this.heap.push(node);
  bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
};

BHProto.peek = function () {
  return this.heap[0];
};

BHProto.pop = function () {
  var front = this.heap[0];
  var end = this.heap.pop();
  if (this.heap.length > 0) {
    this.heap[0] = end;
    bubbleDown(this.heap, this.weightFunc, 0);
  }
  return front;
};

BHProto.remove = function (node) {
  var length = this.heap.length;
  for (var i = 0; i < length; i++) {
    if (this.compareFunc(this.heap[i], node)) {
      var removed = this.heap[i];
      var end = this.heap.pop();
      if (i !== length - 1) {
        this.heap[i] = end;
        bubbleUp(this.heap, this.weightFunc, i);
        bubbleDown(this.heap, this.weightFunc, i);
      }
      return removed;
    }
  }
  return null;
};

BHProto.removeAll = function () {
  this.heap = [];
};

BHProto.size = function () {
  return this.heap.length;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

























var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var _Promise = null;
try {
  _Promise = window.Promise;
} catch (e) {}

var utils = {
  isNumber: function isNumber(value) {
    return typeof value === 'number';
  },
  isString: function isString(value) {
    return typeof value === 'string';
  },
  isObject: function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  },
  isFunction: function isFunction(value) {
    return typeof value === 'function';
  },
  fromJson: function fromJson(value) {
    return JSON.parse(value);
  },
  toJson: function toJson(value) {
    return JSON.stringify(value);
  },
  equals: function equals(a, b) {
    return a === b;
  },


  Promise: _Promise
};

function _isPromiseLike(value) {
  return value && utils.isFunction(value.then);
}

var defaults$$1 = {
  capacity: Number.MAX_VALUE,
  cacheFlushInterval: null,
  deleteOnExpire: 'none',
  enabled: true,
  onExpire: null,
  maxAge: Number.MAX_VALUE,
  recycleFreq: 1000,
  storageMode: 'memory',
  storageImpl: null,
  storagePrefix: 'cachefactory.caches.',
  storeOnReject: false,
  storeOnResolve: false
};

var assignMsg = 'Cannot assign to read only property';

var Cache = function () {
  function Cache(id) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    classCallCheck(this, Cache);

    if (!utils.isString(id)) {
      throw new TypeError('"id" must be a string!');
    }

    Object.defineProperties(this, {
      // Writable
      $$cacheFlushInterval: { writable: true, value: undefined },
      $$cacheFlushIntervalId: { writable: true, value: undefined },
      $$capacity: { writable: true, value: undefined },
      $$data: { writable: true, value: {} },
      $$deleteOnExpire: { writable: true, value: undefined },
      $$enabled: { writable: true, value: undefined },
      $$expiresHeap: { writable: true, value: new BinaryHeap(function (x) {
          x.accessed;
        }, utils.equals) },
      $$initializing: { writable: true, value: true },
      $$lruHeap: { writable: true, value: new BinaryHeap(function (x) {
          x.accessed;
        }, utils.equals) },
      $$maxAge: { writable: true, value: undefined },
      $$onExpire: { writable: true, value: undefined },
      $$prefix: { writable: true, value: '' },
      $$promises: { writable: true, value: {} },
      $$recycleFreq: { writable: true, value: undefined },
      $$recycleFreqId: { writable: true, value: undefined },
      $$storage: { writable: true, value: undefined },
      $$storageMode: { writable: true, value: undefined },
      $$storagePrefix: { writable: true, value: undefined },
      $$storeOnReject: { writable: true, value: undefined },
      $$storeOnResolve: { writable: true, value: undefined },

      // Read-only
      $$parent: { value: options.parent },

      /**
       * @name Cache#capacity
       * @public
       * @readonly
       * @type {number}
       */
      capacity: {
        enumerable: true,
        get: function get() {
          return _this.$$capacity;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'capacity\'');
        }
      },

      /**
       * @name Cache#cacheFlushInterval
       * @public
       * @readonly
       * @type {number|null}
       */
      cacheFlushInterval: {
        enumerable: true,
        get: function get() {
          return _this.$$cacheFlushInterval;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'cacheFlushInterval\'');
        }
      },

      /**
       * @name Cache#deleteOnExpire
       * @public
       * @readonly
       * @type {string}
       */
      deleteOnExpire: {
        enumerable: true,
        get: function get() {
          return _this.$$deleteOnExpire;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'deleteOnExpire\'');
        }
      },

      /**
       * @name Cache#enabled
       * @public
       * @readonly
       * @type {boolean}
       */
      enabled: {
        enumerable: true,
        get: function get() {
          return _this.$$enabled;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'enabled\'');
        }
      },

      /**
       * @name Cache#id
       * @public
       * @readonly
       * @type {string}
       */
      id: {
        enumerable: true,
        value: id
      },

      /**
       * @name Cache#maxAge
       * @public
       * @readonly
       * @type {number}
       */
      maxAge: {
        enumerable: true,
        get: function get() {
          return _this.$$maxAge;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'maxAge\'');
        }
      },

      /**
       * @name Cache#onExpire
       * @public
       * @readonly
       * @type {function}
       */
      onExpire: {
        enumerable: true,
        get: function get() {
          return _this.$$onExpire;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'onExpire\'');
        }
      },

      /**
       * @name Cache#recycleFreq
       * @public
       * @readonly
       * @type {number|null}
       */
      recycleFreq: {
        enumerable: true,
        get: function get() {
          return _this.$$recycleFreq;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'recycleFreq\'');
        }
      },

      /**
       * @name Cache#storageMode
       * @public
       * @readonly
       * @type {string}
       */
      storageMode: {
        enumerable: true,
        get: function get() {
          return _this.$$storageMode;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'storageMode\'');
        }
      },

      /**
       * @name Cache#storagePrefix
       * @public
       * @readonly
       * @type {string}
       */
      storagePrefix: {
        enumerable: true,
        get: function get() {
          return _this.$$storagePrefix;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'storagePrefix\'');
        }
      },

      /**
       * @name Cache#storeOnReject
       * @public
       * @readonly
       * @type {boolean}
       */
      storeOnReject: {
        enumerable: true,
        get: function get() {
          return _this.$$storeOnReject;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'storeOnReject\'');
        }
      },

      /**
       * @name Cache#storeOnResolve
       * @public
       * @readonly
       * @type {boolean}
       */
      storeOnResolve: {
        enumerable: true,
        get: function get() {
          return _this.$$storeOnResolve;
        },
        set: function set() {
          throw new Error(assignMsg + ' \'storeOnResolve\'');
        }
      }
    });

    this.setOptions(options, true);
    this.$$initializing = false;
  }

  /**
   * TODO
   *
   * @method Cache#destroy
   */


  createClass(Cache, [{
    key: 'destroy',
    value: function destroy() {
      clearInterval(this.$$cacheFlushIntervalId);
      clearInterval(this.$$recycleFreqId);
      this.removeAll();
      if (this.$$storage) {
        this.$$storage().removeItem(this.$$prefix + '.keys');
        this.$$storage().removeItem(this.$$prefix);
      }
      this.$$storage = null;
      this.$$data = null;
      this.$$lruHeap = null;
      this.$$expiresHeap = null;
      this.$$prefix = null;
      if (this.$$parent) {
        this.$$parent.caches[this.id] = undefined;
      }
    }

    /**
     * TODO
     *
     * @method Cache#disable
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.$$enabled = false;
    }

    /**
     * TODO
     *
     * @method Cache#enable
     */

  }, {
    key: 'enable',
    value: function enable() {
      this.$$enabled = true;
    }

    /**
     * TODO
     *
     * @method Cache#get
     * @param {string|string[]} key TODO
     * @param {object} [options] TODO
     * @returns {*} TODO
     */

  }, {
    key: 'get',
    value: function get(key) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (Array.isArray(key)) {
        var _ret = function () {
          var keys = key;
          var values = [];

          keys.forEach(function (key) {
            var value = _this2.get(key, options);
            if (value !== null && value !== undefined) {
              values.push(value);
            }
          });

          return {
            v: values
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        key = '' + key;

        if (!this.enabled) {
          return;
        }
      }

      if (!utils.isString(key)) {
        throw new TypeError('"key" must be a string!');
      } else if (options && !utils.isObject(options)) {
        throw new TypeError('"options" must be an object!');
      } else if (options.onExpire && !utils.isFunction(options.onExpire)) {
        throw new TypeError('"options.onExpire" must be a function!');
      }

      var item = void 0;

      if (this.$$storage) {
        if (this.$$promises[key]) {
          return this.$$promises[key];
        }

        var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);

        if (itemJson) {
          item = utils.fromJson(itemJson);
        }
      } else if (utils.isObject(this.$$data)) {
        item = this.$$data[key];
      }

      if (!item) {
        return;
      }

      var value = item.value;
      var now = new Date().getTime();

      if (this.$$storage) {
        this.$$lruHeap.remove({
          key: key,
          accessed: item.accessed
        });
        item.accessed = now;
        this.$$lruHeap.push({
          key: key,
          accessed: now
        });
      } else {
        this.$$lruHeap.remove(item);
        item.accessed = now;
        this.$$lruHeap.push(item);
      }

      if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
        this.remove(key);

        if (this.$$onExpire) {
          this.$$onExpire(key, item.value, options.onExpire);
        } else if (options.onExpire) {
          options.onExpire.call(this, key, item.value);
        }
        value = undefined;
      } else if (this.$$storage) {
        this.$$storage().setItem(this.$$prefix + '.data.' + key, utils.toJson(item));
      }

      return value;
    }

    /**
     * TODO
     *
     * @method Cache#info
     * @param {string|string[]} key TODO
     * @returns {*} TODO
     */

  }, {
    key: 'info',
    value: function info(key) {
      if (key) {
        var item = void 0;
        if (this.$$storage) {
          var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);
          if (itemJson) {
            item = utils.fromJson(itemJson);
          }
        } else if (utils.isObject(this.$$data)) {
          item = this.$$data[key];
        }
        if (item) {
          return {
            created: item.created,
            accessed: item.accessed,
            expires: item.expires,
            isExpired: new Date().getTime() - item.created > (item.maxAge || this.$$maxAge)
          };
        }
      } else {
        return {
          id: this.id,
          capacity: this.capacity,
          maxAge: this.maxAge,
          deleteOnExpire: this.deleteOnExpire,
          onExpire: this.onExpire,
          cacheFlushInterval: this.cacheFlushInterval,
          recycleFreq: this.recycleFreq,
          storageMode: this.storageMode,
          storageImpl: this.$$storage ? this.$$storage() : undefined,
          enabled: this.enabled,
          size: this.$$lruHeap && this.$$lruHeap.size() || 0
        };
      }
    }

    /**
     * TODO
     *
     * @method Cache#keys
     * @returns {*} TODO
     */

  }, {
    key: 'keys',
    value: function keys() {
      if (this.$$storage) {
        var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');

        if (keysJson) {
          return utils.fromJson(keysJson);
        } else {
          return [];
        }
      } else {
        return Object.keys(this.$$data);
      }
    }

    /**
     * TODO
     *
     * @method Cache#keySet
     * @returns {*} TODO
     */

  }, {
    key: 'keySet',
    value: function keySet() {
      var set$$1 = {};
      this.keys().forEach(function (key) {
        set$$1[key] = key;
      });
      return set$$1;
    }

    /**
     * TODO
     *
     * @method Cache#put
     * @param {string} key TODO
     * @param {*} value TODO
     * @param {object} [options] TODO
     * @returns {*} TODO
     */

  }, {
    key: 'put',
    value: function put(key, value) {
      var _this3 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var storeOnResolve = options.storeOnResolve !== undefined ? !!options.storeOnResolve : this.$$storeOnResolve;
      var storeOnReject = options.storeOnReject !== undefined ? !!options.storeOnReject : this.$$storeOnReject;

      var getHandler = function getHandler(store, isError) {
        return function (v) {
          if (store) {
            _this3.$$promises[key] = undefined;
            if (utils.isObject(v) && 'status' in v && 'data' in v) {
              v = [v.status, v.data, v.headers(), v.statusText];
              _this3.put(key, v);
            } else {
              _this3.put(key, v);
            }
          }
          if (isError) {
            if (utils.Promise) {
              return utils.Promise.reject(v);
            } else {
              throw v;
            }
          } else {
            return v;
          }
        };
      };

      if (!this.$$enabled || !utils.isObject(this.$$data) || value === null || value === undefined) {
        return;
      }
      key = '' + key;

      if (!utils.isString(key)) {
        throw new Error('"key" must be a string!');
      }

      var now = new Date().getTime();
      var item = {
        key: key,
        value: _isPromiseLike(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value,
        created: options.created === undefined ? now : options.created,
        accessed: options.accessed === undefined ? now : options.accessed
      };
      if (utils.isNumber(options.maxAge)) {
        item.maxAge = options.maxAge;
      }

      if (options.expires === undefined) {
        item.expires = item.created + (item.maxAge || this.$$maxAge);
      } else {
        item.expires = options.expires;
      }

      if (this.$$storage) {
        if (_isPromiseLike(item.value)) {
          this.$$promises[key] = item.value;
          return this.$$promises[key];
        }
        var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');
        var keys = keysJson ? utils.fromJson(keysJson) : [];
        var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);

        // Remove existing
        if (itemJson) {
          this.remove(key);
        }
        // Add to expires heap
        this.$$expiresHeap.push({
          key: key,
          expires: item.expires
        });
        // Add to lru heap
        this.$$lruHeap.push({
          key: key,
          accessed: item.accessed
        });
        // Set item
        this.$$storage().setItem(this.$$prefix + '.data.' + key, utils.toJson(item));
        var exists = false;
        keys.forEach(function (_key) {
          if (_key === key) {
            exists = true;
            return false;
          }
        });
        if (!exists) {
          keys.push(key);
        }
        this.$$storage().setItem(this.$$prefix + '.keys', utils.toJson(keys));
      } else {
        // Remove existing
        if (this.$$data[key]) {
          this.remove(key);
        }
        // Add to expires heap
        this.$$expiresHeap.push(item);
        // Add to lru heap
        this.$$lruHeap.push(item);
        // Set item
        this.$$data[key] = item;
        this.$$promises[key] = undefined;
      }

      // Handle exceeded capacity
      if (this.$$lruHeap.size() > this.$$capacity) {
        this.remove(this.$$lruHeap.peek().key);
      }

      return value;
    }

    /**
     * TODO
     *
     * @method Cache#remove
     * @param {string} key TODO
     * @returns {*} TODO
     */

  }, {
    key: 'remove',
    value: function remove(key) {
      key = '' + key;
      this.$$promises[key] = undefined;
      if (this.$$storage) {
        var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);

        if (itemJson) {
          var item = utils.fromJson(itemJson);
          this.$$lruHeap.remove({
            key: key,
            accessed: item.accessed
          });
          this.$$expiresHeap.remove({
            key: key,
            expires: item.expires
          });
          this.$$storage().removeItem(this.$$prefix + '.data.' + key);
          var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');
          var keys = keysJson ? utils.fromJson(keysJson) : [];
          var index = keys.indexOf(key);

          if (index >= 0) {
            keys.splice(index, 1);
          }
          this.$$storage().setItem(this.$$prefix + '.keys', utils.toJson(keys));
          return item.value;
        }
      } else if (utils.isObject(this.$$data)) {
        var value = this.$$data[key] ? this.$$data[key].value : undefined;
        this.$$lruHeap.remove(this.$$data[key]);
        this.$$expiresHeap.remove(this.$$data[key]);
        this.$$data[key] = undefined;
        return value;
      }
    }

    /**
     * TODO
     *
     * @method Cache#removeAll
     */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _this4 = this;

      var storage = this.$$storage;
      var keys = this.keys();
      this.$$lruHeap.removeAll();
      this.$$expiresHeap.removeAll();

      if (storage) {
        storage().setItem(this.$$prefix + '.keys', utils.toJson([]));
        keys.forEach(function (key) {
          storage().removeItem(_this4.$$prefix + '.data.' + key);
        });
      } else if (utils.isObject(this.$$data)) {
        this.$$data = {};
      }
      this.$$promises = {};
    }

    /**
     * TODO
     *
     * @method Cache#removeExpired
     * @returns {object} TODO
     */

  }, {
    key: 'removeExpired',
    value: function removeExpired() {
      var _this5 = this;

      var now = new Date().getTime();
      var expired = {};
      var expiredItem = void 0;

      while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires <= now) {
        expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
        this.$$expiresHeap.pop();
      }

      Object.keys(expired).forEach(function (key) {
        _this5.remove(key);
      });

      if (this.$$onExpire) {
        Object.keys(expired).forEach(function (key) {
          _this5.$$onExpire(key, expired[key]);
        });
      }

      return expired;
    }

    /**
     * TODO
     *
     * @method Cache#setCacheFlushInterval
     * @param {number|null} cacheFlushInterval TODO
     */

  }, {
    key: 'setCacheFlushInterval',
    value: function setCacheFlushInterval(cacheFlushInterval) {
      var _this6 = this;

      if (cacheFlushInterval === null) {
        this.$$cacheFlushInterval = null;
      } else if (!utils.isNumber(cacheFlushInterval)) {
        throw new TypeError('"cacheFlushInterval" must be a number!');
      } else if (cacheFlushInterval <= 0) {
        throw new Error('"cacheFlushInterval" must be greater than zero!');
      }
      this.$$cacheFlushInterval = cacheFlushInterval;
      clearInterval(this.$$cacheFlushIntervalId);
      this.$$cacheFlushIntervalId = undefined;
      if (this.$$cacheFlushInterval) {
        this.$$cacheFlushIntervalId = setInterval(function () {
          return _this6.removeAll();
        }, this.$$cacheFlushInterval);
      }
    }

    /**
     * TODO
     *
     * @method Cache#setCapacity
     * @param {number|null} capacity TODO
     */

  }, {
    key: 'setCapacity',
    value: function setCapacity(capacity) {
      if (capacity === null) {
        this.$$capacity = null;
      } else if (!utils.isNumber(capacity)) {
        throw new TypeError('"capacity" must be a number!');
      } else if (capacity <= 0) {
        throw new Error('"capacity" must be greater than zero!');
      } else {
        this.$$capacity = capacity;
      }
      var removed = {};
      while (this.$$lruHeap.size() > this.$$capacity) {
        removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
      }
      return removed;
    }

    /**
     * TODO
     *
     * @method Cache#setDeleteOnExpire
     * @param {string|null} deleteOnExpire TODO
     * @param {boolean} [setRecycleFreq] TODO
     */

  }, {
    key: 'setDeleteOnExpire',
    value: function setDeleteOnExpire(deleteOnExpire, setRecycleFreq) {
      if (deleteOnExpire === null) {
        deleteOnExpire = 'none';
      } else if (!utils.isString(deleteOnExpire)) {
        throw new TypeError('"deleteOnExpire" must be a string!');
      } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
        throw new Error('"deleteOnExpire" must be "none", "passive" or "aggressive"!');
      }
      this.$$deleteOnExpire = deleteOnExpire;
      if (setRecycleFreq !== false) {
        this.setRecycleFreq(this.$$recycleFreq);
      }
    }

    /**
     * TODO
     *
     * @method Cache#setMaxAge
     * @param {number|null} maxAge TODO
     */

  }, {
    key: 'setMaxAge',
    value: function setMaxAge(maxAge) {
      var _this7 = this;

      if (maxAge === null) {
        this.$$maxAge = Number.MAX_VALUE;
      } else if (!utils.isNumber(maxAge)) {
        throw new TypeError('"maxAge" must be a number!');
      } else if (maxAge <= 0) {
        throw new Error('"maxAge" must be greater than zero!');
      } else {
        this.$$maxAge = maxAge;
      }
      var keys = this.keys();

      this.$$expiresHeap.removeAll();

      if (this.$$storage) {
        keys.forEach(function (key) {
          var itemJson = _this7.$$storage().getItem(_this7.$$prefix + '.data.' + key);
          if (itemJson) {
            var item = utils.fromJson(itemJson);
            if (_this7.$$maxAge === Number.MAX_VALUE) {
              item.expires = Number.MAX_VALUE;
            } else {
              item.expires = item.created + (item.maxAge || _this7.$$maxAge);
            }
            _this7.$$expiresHeap.push({
              key: key,
              expires: item.expires
            });
          }
        });
      } else {
        keys.forEach(function (key) {
          var item = _this7.$$data[key];
          if (item) {
            if (_this7.$$maxAge === Number.MAX_VALUE) {
              item.expires = Number.MAX_VALUE;
            } else {
              item.expires = item.created + (item.maxAge || _this7.$$maxAge);
            }
            _this7.$$expiresHeap.push(item);
          }
        });
      }

      if (this.$$deleteOnExpire === 'aggressive') {
        return this.removeExpired();
      } else {
        return {};
      }
    }

    /**
     * TODO
     *
     * @method Cache#setOnExpire
     * @param {function|null} onExpire TODO
     */

  }, {
    key: 'setOnExpire',
    value: function setOnExpire(onExpire) {
      if (onExpire === null) {
        this.$$onExpire = null;
      } else if (!utils.isFunction(onExpire)) {
        throw new TypeError('"onExpire" must be a function!');
      } else {
        this.$$onExpire = onExpire;
      }
    }

    /**
     * TODO
     *
     * @method Cache#setOptions
     * @param {object} options TODO
     * @param {boolean} [strict] TODO
     */

  }, {
    key: 'setOptions',
    value: function setOptions() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var strict = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (!utils.isObject(options)) {
        throw new TypeError('"options" must be an object!');
      }

      if (options.storagePrefix !== undefined) {
        this.$$storagePrefix = options.storagePrefix;
      } else if (strict) {
        this.$$storagePrefix = defaults$$1.storagePrefix;
      }

      this.$$prefix = this.$$storagePrefix + this.$$id;

      if (options.enabled !== undefined) {
        this.$$enabled = !!options.enabled;
      } else if (strict) {
        this.$$enabled = defaults$$1.enabled;
      }

      if (options.deleteOnExpire !== undefined) {
        this.setDeleteOnExpire(options.deleteOnExpire, false);
      } else if (strict) {
        this.setDeleteOnExpire(defaults$$1.deleteOnExpire, false);
      }

      if (options.recycleFreq !== undefined) {
        this.setRecycleFreq(options.recycleFreq);
      } else if (strict) {
        this.setRecycleFreq(defaults$$1.recycleFreq);
      }

      if (options.maxAge !== undefined) {
        this.setMaxAge(options.maxAge);
      } else if (strict) {
        this.setMaxAge(defaults$$1.maxAge);
      }

      if (options.storeOnResolve !== undefined) {
        this.$$storeOnResolve = !!options.storeOnResolve;
      } else if (strict) {
        this.$$storeOnResolve = defaults$$1.storeOnResolve;
      }

      if (options.storeOnReject !== undefined) {
        this.$$storeOnReject = !!options.storeOnReject;
      } else if (strict) {
        this.$$storeOnReject = defaults$$1.storeOnReject;
      }

      if (options.capacity !== undefined) {
        this.setCapacity(options.capacity);
      } else if (strict) {
        this.setCapacity(defaults$$1.capacity);
      }

      if (options.cacheFlushInterval !== undefined) {
        this.setCacheFlushInterval(options.cacheFlushInterval);
      } else if (strict) {
        this.setCacheFlushInterval(defaults$$1.cacheFlushInterval);
      }

      if (options.onExpire !== undefined) {
        this.setOnExpire(options.onExpire);
      } else if (strict) {
        this.setOnExpire(defaults$$1.onExpire);
      }

      if (options.storageMode !== undefined || options.storageImpl !== undefined) {
        this.setStorageMode(options.storageMode || defaults$$1.storageMode, options.storageImpl || defaults$$1.storageImpl);
      } else if (strict) {
        this.setStorageMode(defaults$$1.storageMode, defaults$$1.storageImpl);
      }
    }

    /**
     * TODO
     *
     * @method Cache#setRecycleFreq
     * @param {number|null} recycleFreq TODO
     */

  }, {
    key: 'setRecycleFreq',
    value: function setRecycleFreq(recycleFreq) {
      var _this8 = this;

      if (recycleFreq === null) {
        this.$$recycleFreq = null;
      } else if (!utils.isNumber(recycleFreq)) {
        throw new TypeError('"recycleFreq" must be a number!');
      } else if (recycleFreq <= 0) {
        throw new Error('"recycleFreq" must be greater than zero!');
      } else {
        this.$$recycleFreq = recycleFreq;
      }
      clearInterval(this.$$recycleFreqId);
      if (this.$$deleteOnExpire === 'aggressive' && this.$$recycleFreq) {
        this.$$recycleFreqId = setInterval(function () {
          return _this8.removeExpired();
        }, this.$$recycleFreq);
      } else {
        this.$$recycleFreqId = undefined;
      }
    }

    /**
     * TODO
     *
     * @method Cache#setStorageMode
     * @param {string} storageMode TODO
     * @param {object} storageImpl TODO
     */

  }, {
    key: 'setStorageMode',
    value: function setStorageMode(storageMode, storageImpl) {
      var _this9 = this;

      if (!utils.isString(storageMode)) {
        throw new TypeError('"storageMode" must be a string!');
      } else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
        throw new Error('"storageMode" must be "memory", "localStorage", or "sessionStorage"!');
      }

      var prevStorage = this.$$storage;
      var prevData = this.$$data;
      var shouldReInsert = false;
      var items = {};

      var load = function load(prevStorage, prevData) {
        var keys = _this9.keys();
        var prevDataIsObject = utils.isObject(prevData);
        keys.forEach(function (key) {
          if (prevStorage) {
            var itemJson = prevStorage().getItem(_this9.$$prefix + '.data.' + key);
            if (itemJson) {
              items[key] = utils.fromJson(itemJson);
            }
          } else if (prevDataIsObject) {
            items[key] = prevData[key];
          }
          _this9.remove(key);
          shouldReInsert || (shouldReInsert = true);
        });
      };

      if (!this.$$initializing) {
        load(prevStorage, prevData);
      }

      this.$$storageMode = storageMode;

      if (storageImpl) {
        if (!utils.isObject(storageImpl)) {
          throw new TypeError('"storageImpl" must be an object!');
        } else if (typeof storageImpl.setItem !== 'function') {
          throw new Error('"storageImpl" must implement "setItem(key, value)"!');
        } else if (typeof storageImpl.getItem !== 'function') {
          throw new Error('"storageImpl" must implement "getItem(key)"!');
        } else if (typeof storageImpl.removeItem !== 'function') {
          throw new Error('"storageImpl" must implement "removeItem(key)"!');
        }
        this.$$storage = function () {
          return storageImpl;
        };
      } else if (this.$$storageMode === 'localStorage') {
        try {
          localStorage.setItem('cachefactory', 'cachefactory');
          localStorage.removeItem('cachefactory');
          this.$$storage = function () {
            return localStorage;
          };
        } catch (e) {
          this.$$storage = null;
          this.$$storageMode = 'memory';
        }
      } else if (this.$$storageMode === 'sessionStorage') {
        try {
          sessionStorage.setItem('cachefactory', 'cachefactory');
          sessionStorage.removeItem('cachefactory');
          this.$$storage = function () {
            return sessionStorage;
          };
        } catch (e) {
          this.$$storage = null;
          this.$$storageMode = 'memory';
        }
      } else {
        this.$$storage = null;
        this.$$storageMode = 'memory';
      }

      if (this.$$initializing) {
        load(this.$$storage, this.$$data);
      }

      if (shouldReInsert) {
        Object.keys(items).forEach(function (key) {
          var item = items[key];
          _this9.put(key, item.value, {
            created: item.created,
            accessed: item.accessed,
            expires: item.expires
          });
        });
      }
    }

    /**
     * TODO
     *
     * @method Cache#touch
     * @param {string} key TODO
     * @param {object} [options] TODO
     */

  }, {
    key: 'touch',
    value: function touch(key, options) {
      var _this10 = this;

      if (key) {
        var val = this.get(key, {
          onExpire: function onExpire(k, v) {
            return _this10.put(k, v);
          }
        });
        if (val) {
          this.put(key, val, options);
        }
      } else {
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
          this.touch(keys[i], options);
        }
      }
    }

    /**
     * TODO
     *
     * @method Cache#values
     * @returns {array} TODO
     */

  }, {
    key: 'values',
    value: function values() {
      var _this11 = this;

      return this.keys().map(function (key) {
        return _this11.get(key);
      });
    }
  }]);
  return Cache;
}();

/**
 * TODO
 *
 * @class CacheFactory
 */


var CacheFactory = function () {
  function CacheFactory() {
    classCallCheck(this, CacheFactory);

    Object.defineProperty(this, 'caches', {
      writable: true,
      value: {}
    });
  }

  /**
   * Calls {@link Cache#removeAll} on each {@link Cache} in this
   * {@link CacheFactory}.
   *
   * @method CacheFactory#clearAll
   */


  createClass(CacheFactory, [{
    key: 'clearAll',
    value: function clearAll() {
      var _this12 = this;

      this.keys().forEach(function (cacheId) {
        _this12.get(cacheId).removeAll();
      });
    }

    /**
     * Create a new {@link Cache}. If a cache with the same `id` had been created
     * in a previous browser session, then it will attempt to load any data that
     * had been saved previously.
     *
     * @method CacheFactory#createCache
     * @param {string} id A unique identifier for the new {@link Cache}.
     * @param {object} [options] Configuration options. See {@link Cache}.
     * @returns {Cache} The new {@link Cache} instance.
     */

  }, {
    key: 'createCache',
    value: function createCache(id) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (this.caches[id]) {
        throw new Error('cache "' + id + '" already exists!');
      }
      this.caches[id] = new CacheFactory.Cache(id, options);
      return this.caches[id];
    }

    /**
     * Calls {@link Cache#destroy} on the {@link Cache} in this
     * {@link CacheFactory} that has the specified `id`.
     *
     * @method CacheFactory#destroy
     * @param {string} id TODO
     */

  }, {
    key: 'destroy',
    value: function destroy(id) {
      this.get(id).destroy();
      this.caches[id] = undefined;
    }

    /**
     * Calls {@link Cache#destroy} on each {@link Cache} in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#destroyAll
     */

  }, {
    key: 'destroyAll',
    value: function destroyAll() {
      var _this13 = this;

      this.keys().forEach(function (id) {
        _this13.get(id).destroy();
      });
      this.caches = {};
    }

    /**
     * Calls {@link Cache#disable} on each {@link Cache} in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#disableAll
     */

  }, {
    key: 'disableAll',
    value: function disableAll() {
      var _this14 = this;

      this.keys().forEach(function (cacheId) {
        _this14.get(cacheId).disable();
      });
    }

    /**
     * Calls {@link Cache#enable} on each {@link Cache} in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#enableAll
     */

  }, {
    key: 'enableAll',
    value: function enableAll() {
      var _this15 = this;

      this.keys().forEach(function (cacheId) {
        _this15.get(cacheId).enable();
      });
    }

    /**
     * Returns whether the {@link Cache} with the specified `id` exists in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#exists
     * @returns {boolean} Whether the {@link Cache} with the specified `id` exists
     * in this {@link CacheFactory}.
     */

  }, {
    key: 'exists',
    value: function exists(id) {
      return !!this.caches[id];
    }

    /**
     * Returns a reference to the {@link Cache} in this {@link CacheFactory} that
     * has the specified `id`.
     *
     * @method CacheFactory#get
     * @param {string} id The `id` of the {@link Cache} to retrieve.
     * @returns {Cache} The {@link Cache} instance.
     * @throws {ReferenceError} Throws a `ReferenceError` if the {@link Cache}
     * does not exist.
     */

  }, {
    key: 'get',
    value: function get(id) {
      var cache = this.caches[id];
      if (!cache) {
        throw new ReferenceError('Cache "' + id + '" does not exist!');
      }
      return cache;
    }

    /**
     * Returns information on this {@link CacheFactory} and its {@link Cache}
     * instance.
     *
     * @method CacheFactory#info
     * @returns {object} The detailed information.
     */

  }, {
    key: 'info',
    value: function info() {
      var _this16 = this;

      var keys = this.keys();
      var info = {
        size: keys.length,
        caches: {}
      };
      keys.forEach(function (cacheId) {
        info.caches[cacheId] = _this16.get(cacheId).info();
      });
      Object.keys(CacheFactory.defaults).forEach(function (key, value) {
        info[key] = CacheFactory.defaults[key];
      });
      return info;
    }

    /**
     * Returns an array of identifiers of the {@link Cache} instances in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#keys
     * @returns {string[]} The {@link Cache} identifiers.
     */

  }, {
    key: 'keys',
    value: function keys() {
      var _this17 = this;

      return Object.keys(this.caches).filter(function (key) {
        return _this17.caches[key];
      });
    }

    /**
     * Returns an object of key-value pairs representing the identifiers of the
     * {@link Cache} instances in this {@link CacheFactory}.
     *
     * @method CacheFactory#keySet
     * @returns {object} The {@link Cache} identifiers.
     */

  }, {
    key: 'keySet',
    value: function keySet() {
      var set$$1 = {};
      this.keys().forEach(function (key) {
        set$$1[key] = key;
      });
      return set$$1;
    }

    /**
     * Calls {@link Cache#removeExpired} on each {@link Cache} in this
     * {@link CacheFactory} and returns the removed items, if any.
     *
     * @method CacheFactory#removeExpiredFromAll
     * @returns {object} The removed items, if any.
     */

  }, {
    key: 'removeExpiredFromAll',
    value: function removeExpiredFromAll() {
      var _this18 = this;

      var expired = {};
      this.keys().forEach(function (id) {
        expired[id] = _this18.get(id).removeExpired();
      });
      return expired;
    }

    /**
     * Calls {@link Cache#touch} on each {@link Cache} in this
     * {@link CacheFactory}.
     *
     * @method CacheFactory#touchAll
     */

  }, {
    key: 'touchAll',
    value: function touchAll() {
      var _this19 = this;

      this.keys().forEach(function (cacheId) {
        _this19.get(cacheId).touch();
      });
    }
  }]);
  return CacheFactory;
}();

CacheFactory.BinaryHeap = BinaryHeap;
CacheFactory.Cache = Cache;
CacheFactory.CacheFactory = CacheFactory;
CacheFactory.defaults = defaults$$1;
CacheFactory.utils = utils;

return CacheFactory;

})));
//# sourceMappingURL=cachefactory.js.map
