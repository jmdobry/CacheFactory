export default {
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
}
