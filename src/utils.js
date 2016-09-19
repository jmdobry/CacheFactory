let _Promise = null
try {
  _Promise = window.Promise
} catch (e) {}

/**
 * Utility methods used by CacheFactory.
 *
 * @example
 * import { utils } from 'cachefactory'
 * console.log(utils.isString('foo')) // true
 *
 * @namespace utils
 * @type {object}
 */
const utils = {
  /**
   * Returns whether the two values are strictly equal.
   *
   * @example
   * import { utils } from 'cachefactory'
   *
   * console.log(utils.equals(4, 4) // true
   * console.log(utils.equals(4, '4') // false
   *
   * @method utils.equals
   * @param {*} a The first value.
   * @param {*} a The second value.
   * @returns {booleal} Whether the two values are strictly equal.
   */
  equals (a, b) {
    return a === b
  },

  /**
   * Proxy for `JSON.parse`.
   *
   * @example
   * import { utils } from 'cachefactory'
   *
   * const a = utils.fromJson('{"name":"John"}')
   * console.log(a) // { name: 'John' }
   *
   * @method utils.fromJson
   * @param {string} json JSON to parse.
   * @returns {object} The parsed object.
   * @see utils.toJson
   */
  fromJson (value) {
    return JSON.parse(value)
  },

  /**
   * Returns whether the provided value is a function.
   *
   * @example
   * import { utils } from 'cachefactory'
   * const a = function (){ console.log('foo bar')}
   * const b = { foo: "bar" }
   * console.log(utils.isFunction(a)) // true
   * console.log(utils.isFunction(b)) // false
   *
   * @method utils.isFunction
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a function.
   */
  isFunction (value) {
    return typeof value === 'function'
  },

  /**
   * Returns whether the provided value is a number.
   *
   * @example
   * import { utils } from 'js-data'
   * const a = 1
   * const b = -1.25
   * const c = '1'
   * console.log(utils.isNumber(a)) // true
   * console.log(utils.isNumber(b)) // true
   * console.log(utils.isNumber(c)) // false
   *
   * @method utils.isNumber
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a number.
   */
  isNumber (value) {
    return typeof value === 'number'
  },

  /**
   * Returns whether the provided value is an object.
   *
   * @example
   * import { utils } from 'cachefactory'
   * const a = { foo: "bar" }
   * const b = 'foo bar'
   * console.log(utils.isObject(a)) // true
   * console.log(utils.isObject(b)) // false
   *
   * @method utils.isObject
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is an object.
   */
  isObject (value) {
    return value !== null && typeof value === 'object'
  },

  isPromise (value) {
    return value && utils.isFunction(value.then)
  },

  /**
   * Returns whether the provided value is a string.
   *
   * @example
   * import { utils } from 'cachefactory'
   * console.log(utils.isString('')) // true
   * console.log(utils.isString('my string')) // true
   * console.log(utils.isString(100)) // false
   * console.log(utils.isString([1,2,4])) // false
   *
   * @method utils.isString
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a string.
   */
  isString (value) {
    return typeof value === 'string'
  },

  /**
   * Proxy for `JSON.stringify`.
   *
   * @example
   * import { utils } from 'cachefactory'
   *
   * const a = { name: 'John' }
   * console.log(utils.toJson(a)) // '{"name":"John"}'
   *
   * @method utils.toJson
   * @param {*} value Value to serialize to JSON.
   * @returns {string} JSON string.
   * @see utils.fromJson
   */
  toJson (value) {
    return JSON.stringify(value)
  },

  Promise: _Promise
}

export default utils
