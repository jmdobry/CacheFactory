import BinaryHeap from './BinaryHeap'
import Cache from './Cache'
import CacheFactory from './CacheFactory'
import defaults from './defaults'
import utils from './utils'

CacheFactory.Cache = Cache

export {
  /**
   * Registered as `cachefactory` in NPM and Bower.
   *
   * @module cachefactory
   *
   * @example <caption>Install from NPM</caption>
   * npm i --save cachefactory
   * @example <caption>Install from Bower</caption>
   * bower i --save cachefactory
   * @example <caption>Load into your app via script tag</caption>
   * <script src="/path/to/cachefactory.min.js"></script>
   * @example <caption>Load into your app via CommonJS</caption>
   * var cacheFactory = new require('cachefactory').CacheFactory();
   * @example <caption>Load into your app via ES2015 Modules</caption>
   * import { CacheFactory } from 'cachefactory';
   * @example <caption>Load into your app via AMD</caption>
   * define('myApp', ['cachefactory'], function (cachefactory) {
   *   const cacheFactory = new cachefactory.CacheFactory();
   * });
   */
  CacheFactory,

  /**
   * The `BinaryHeap` constructor function.
   *
   * @example
   * import { BinaryHeap, CacheFactory } from 'cachefactory';
   *
   * @name BinaryHeap
   * @memberof module:cachefactory
   * @see https://github.com/jmdobry/yabh
   * @type {function}
   */
  BinaryHeap,

  /**
   * The {@link Cache} constructor function.
   *
   * @example
   * import { Cache, CacheFactory } from 'cachefactory';
   *
   * @name Cache
   * @memberof module:cachefactory
   * @see Cache
   * @type {function}
   */
  Cache,

  /**
   * The default cache values. Modify this object to change the default values.
   *
   * @example
   * import { CacheFactory, defaults } from 'cachefactory';
   *
   * // Change the default "maxAge" for caches that will be instantiated
   * // after this point.
   * defaults.maxAge = 60 * 60 * 1000;
   *
   * @name defaults
   * @memberof module:cachefactory
   * @see Cache
   * @type {object}
   */
  defaults,

  /**
   * Utility functions used throughout this library.
   *
   * @example
   * import Promise from 'bluebird';
   * import { CacheFactory, utils } from 'cachefactory';
   *
   * // Make this library use your Promise lib
   * utils.Promise = Promise;
   *
   * @name utils
   * @memberof module:cachefactory
   * @type {object}
   */
  utils
}
