export class CacheFactory {
	clearAll(): void;
	createCache(id: string, options?: CacheOptions): Cache;
	exists(id: string): boolean;
	get(id: string): Cache;
	info(): CacheFactoryInfo;
	destroy(id: string): void;
	destroyAll(): void;
	disableAll(): void;
	enabledAll(): void;
	keys(): string[];
	keySet(): {[id: string]: string};
	removeExpiredFromAll(): {[id: string]: {[key: string]: any}};
	touchAll(): void;
}

export class Cache {
	id: string;
	destroy(): void;
	disable(): void;
	enable(): void;
	get(key: string|number, options?: GetPutOptions): any;
	info(key: string|number): CacheInfo|ItemInfo;
	keys(): (string|number)[];
	keySet(): {[key: string]: string|number};
	put(key: string|number, value: any, options?: GetPutOptions): any;
	remove(key: string|number): any;
	removeAll(): void;
	removeExpired(): {[key: string]: any};
	setCacheFlushInterval(cacheFlushInterval: number): void;
	setCapacity(capacity: number): void;
	setDeleteOnExpire(deleteOnExpire: DeleteOnExpire, setRecycleFreq?: boolean): void;
	setMaxAge(maxAge: number): void;
	setOnExpire(onExpire: Function): any;
	setOptions(cacheOptions: CacheOptions, strict?: boolean): void;
	setRecycleFreq(recycleFreq: boolean): void;
	setStorageMode(storageMode: StorageMode, storageImpl?: StorageImpl): void;
	touch(key: string|number): void;
	values(): any[];
}
export type DeleteOnExpire = "none"|"passive"|"aggressive";
export type StorageMode = "memory"|"localStorage"|"sessionStorage";
export interface StorageImpl {
	setItem(key: string|number, value: any): void;
	getItem(key: string|number): any;
	removeItem(key: string|number): void;
}
export class BinaryHeap {
	constructor(weightFunc?: Function, compareFunc?: Function);
	peek(): any;
	pop(): any;
	push(node: any): void;
	remove(node: any): void;
	removeAll(): void;
	size(): number;
}
export interface Utils {
	equals(a: any, b: any): boolean;
	fromJson(value: string): any;
	isFunction(value: any): boolean;
	isNumber(value: any): boolean;
	isObject(value: any): boolean;
	isString(value: any): boolean;
	Promise?: PromiseConstructor;
}
export type OnExpireCallback=(key: string, value: any, done?: Function) => void;
export interface CacheOptions {
	cacheFlushInterval?: number;
	capacity?: number;
	deleteOnExpire?: DeleteOnExpire;
	enable?: boolean;
	maxAge?: number;
	onExpire?: OnExpireCallback;
	recycleFreq?: number;
	storageMode?: StorageMode;
	storageImpl?: StorageImpl;
	storagePrefix?: string;
	storeOnResolve?: boolean;
	storeOnReject?: boolean;
}
export interface ItemInfo {
	accessed?: number;
	created?: number;
	expires?: number;
	isExpired?: boolean;
}
export interface GetPutOptions extends ItemInfo {
	maxAge?: number;
	onExpire?: OnExpireCallback;
	storeOnResolve?: boolean;
	storeOnReject?: boolean;
}
export interface CacheInfo extends CacheOptions {
	id: string;
	size: number;
}
export interface CacheFactoryInfo extends CacheOptions {
	size: number;
	caches: {[id: string]: CacheInfo};
}

export const defaults: CacheOptions;
export const utils: Utils;
