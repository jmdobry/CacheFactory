import { assert } from 'chai'
import CacheFactory from '../src/index'
import sinon from 'sinon'

window.pp = function pp (obj) {
  console.log(JSON.stringify(obj, null, 2))
}

assert.objectsEqual = function (a, b, msg) {
  assert.deepEqual(
    JSON.parse(JSON.stringify(a)),
    JSON.parse(JSON.stringify(b)),
    msg || 'Expected objects or arrays to be equal'
  )
}

assert.objectsNotEqual = function (a, b, msg) {
  assert.notDeepEqual(
    JSON.parse(JSON.stringify(a)),
    JSON.parse(JSON.stringify(b)),
    msg || 'Expected objects or arrays to be equal'
  )
}

assert.fail = function (msg) {
  assert.equal('should not reach this!: ' + msg, 'failure')
}

// Setup global data once
export {
  assert,
  CacheFactory,
  sinon
}
export const TYPES_EXCEPT_STRING = [123, 123.123, null, undefined, {}, [], true, false, function () {}]
export const TYPES_EXCEPT_STRING_OR_ARRAY = [123, 123.123, null, undefined, {}, true, false, function () {}]
export const TYPES_EXCEPT_STRING_OR_NUMBER = [null, undefined, {}, [], true, false, function () {}]
export const TYPES_EXCEPT_STRING_OR_OBJECT = [123, 123.123, null, undefined, [], true, false, function () {}]
export const TYPES_EXCEPT_STRING_OR_NUMBER_OBJECT = [null, undefined, [], true, false, function () {}]
export const TYPES_EXCEPT_ARRAY = ['string', 123, 123.123, null, undefined, {}, true, false, function () {}]
export const TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER = [null, undefined, {}, true, false, function () {}]
export const TYPES_EXCEPT_NUMBER = ['string', null, undefined, {}, [], true, false, function () {}]
export const TYPES_EXCEPT_OBJECT = ['string', 123, 123.123, null, undefined, true, false, function () {}]
export const TYPES_EXCEPT_OBJECT_OR_ARRAY = ['string', 123, 123.123, null, undefined, true, false, function () {}]
export const TYPES_EXCEPT_BOOLEAN = ['string', 123, 123.123, null, undefined, {}, [], function () {}]
export const TYPES_EXCEPT_FUNCTION = ['string', 123, 123.123, null, undefined, {}, [], true, false]
export const CACHE_DEFAULTS = {
  capacity: Number.MAX_VALUE,
  maxAge: Number.MAX_VALUE,
  deleteOnExpire: 'none',
  onExpire: null,
  cacheFlushInterval: null,
  recycleFreq: 1000,
  storageMode: 'memory',
  storageImpl: null,
  enabled: true,
  storagePrefix: 'cachefactory.caches.',
  storeOnReject: false,
  storeOnResolve: false
}

let i = 0

beforeEach(function () {
  i++

  this.testId = '' + i
  this.cacheFactory = new CacheFactory()
  this.cacheFactory.destroyAll()
})
