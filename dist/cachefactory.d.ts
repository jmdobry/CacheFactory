declare module 'cachefactory' {
  type DeleteOnExpire = 'none'|'passive'|'aggressive'
  type StorageMode = 'memory'|'localStorage'|'sessionStorage'
  interface StorageImpl {
    setItem: Function,
    getItem: Function,
    removeItem: Function
  }
  class BinaryHeap {
    new(weightFunc?: Function, compareFunc?: Function): BinaryHeap
    peek(): any
    pop(): any
    push(node: any): void
    remove(node: any): void
    removeAll(): void
    size(): number
  }
  interface Utils {
    equals(a: any, b: any): boolean
    fromJson(value: string): any
    isFunction(value: any): boolean
    isNumber(value: any): boolean
    isObject(value: any): boolean
    isString(value: any): boolean
    Promise?: PromiseConstructor
  }
  interface CacheOptions {
    cacheFlushInterval?: number
    capacity?: number
    deleteOnExpire?: DeleteOnExpire
    enable?: boolean
    maxAge?: number
    onExpire?: Function
    recycleFreq?: number
    storageMode?: StorageMode
    storageImpl?: StorageImpl
    storagePrefix?: string
    storeOnResolve?: boolean
    storeOnReject?: boolean
  }
  interface ItemInfo {
    accessed?: number
    created?: number
    expires?: number
    isExpired?: boolean
  }
  interface GetPutOptions extends ItemInfo {
    maxAge?: number
    onExpire?: Function
    storeOnResolve?: boolean
    storeOnReject?: boolean
  }
  interface CacheInfo extends CacheOptions {
    id: string
    size: number
  }
  class Cache {
    id: string
    destroy(): void
    disable(): void
    enable(): void
    get(key: string|number, options?: GetPutOptions): any
    info(key: string|number): CacheInfo|ItemInfo
    keys(): Array<string|number>
    keySet(): { [key: string]: string|number }
    put(key: string|number, value: any, options?: GetPutOptions): any
    remove(key: string|number): any
    removeAll(): void
    removeExpired(): { [key: string]: any }
    setCacheFlushInterval(cacheFlushInterval: number): void
    setCapacity(capacity: number): void
    setDeleteOnExpire(deleteOnExpire: DeleteOnExpire, setRecycleFreq?: boolean): void
    setMaxAge(maxAge: number): void
    setOnExpire(onExpire: Function): any
    setOptions(cacheOptions: CacheOptions, strict?: boolean): void
    setRecycleFreq(recycleFreq: boolean): void
    setStorageMode(storageMode: StorageMode, storageImpl?: StorageImpl): void
    touch(key: string|number): void
    values(): any[]
  }
  interface CacheFactoryInfo extends CacheOptions {
    size: number
    caches: { [id: string]: CacheInfo }
  }
  class CacheFactory {
    static BinaryHeap: typeof BinaryHeap
    static Cache: typeof Cache
    static defaults: CacheOptions
    static utils: Utils
    clearAll(): void
    createCache(id: string, options?: CacheOptions): Cache
    exists(id: string): boolean
    get(id: string): Cache
    info(): CacheFactoryInfo
    destroy(id: string): void
    destroyAll(): void
    disableAll(): void
    enabledAll(): void
    keys(): string[]
    keySet(): { [id: string]: string }
    removeExpiredFromAll(): { [id: string]: { [key: string]: any } }
    touchAll(): void
  }
  export = CacheFactory
}
