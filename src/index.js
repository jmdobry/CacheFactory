import BinaryHeap from '../node_modules/yabh/src/index'
import Cache from './Cache'
import CacheFactory from './CacheFactory'
import defaults from './defaults'
import utils from './utils'

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
 * var CacheFactory = require('cachefactory');
 * @example <caption>Load into your app via ES2015 Modules</caption>
 * import CacheFactory from 'cachefactory';
 * @example <caption>Load into your app via AMD</caption>
 * define('myApp', ['cachefactory'], function (CacheFactory) { ... })
 */
export default CacheFactory

/**
 * The `BinaryHeap` constructor function.
 *
 * @example
 * import CacheFactory from 'cachefactory';
 * const { BinaryHeap } = CacheFactory;
 *
 * @name BinaryHeap
 * @memberof module:cachefactory
 * @see https://github.com/jmdobry/yabh
 * @type {function}
 */
CacheFactory.BinaryHeap = BinaryHeap

/**
 * The {@link Cache} constructor function.
 *
 * @example
 * import CacheFactory from 'cachefactory';
 * const { Cache } = CacheFactory;
 *
 * @name Cache
 * @memberof module:cachefactory
 * @see Cache
 * @type {function}
 */
CacheFactory.Cache = Cache

/**
 * The default cache values. Modify this object to change the default values.
 *
 * @example
 * import CacheFactory from 'cachefactory';
 * const { defaults } = CacheFactory;
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
CacheFactory.defaults = defaults

/**
 * Utility functions used throughout this library.
 *
 * @example
 * import Promise from 'bluebird';
 * import CacheFactory from 'cachefactory';
 * const { utils } = CacheFactory;
 *
 * // Make this library use your Promise lib
 * utils.Promise = Promise;
 *
 * @name utils
 * @memberof module:cachefactory
 * @type {object}
 */
CacheFactory.utils = utils
