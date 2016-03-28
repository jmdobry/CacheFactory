declare var cacheFactory: cacheFactory.cacheFactory;

declare module cacheFactory {
    export interface cacheFactory extends IDefaults {
        new (): cacheFactory;
        createCache(cacheId: string, options: IOptions);
        defaults: IDefaults;
        info(): { size: string, caches: {} };
        get(cacheId: string): {};
        keySet(cacheId: string): {};
        keys(): Array<string>;
        destroy(cacheId: string): void;
        destroyAll(): void;
        clearAll(): void;
        removeExpiredFromAll(): {};
        enableAll(): void;
        disableAll(): void;
        touchAll(): void;
        utils: IUtils;
        BinaryHeap: IBinaryHeap;
    }

    export interface IOptions {
        onExpire: Function;
        storeOnResolve: boolean;
        storeOnReject: boolean;
        created: Date;
        accessed: Date;
        maxAge: number;
        expires: Date;
    }

    export interface IDefaults {
        capacity: number;
        maxAge: number;
        deleteOnExpire: 'none' | 'passive' | 'aggressive';
        onExpire: Function;
        cacheFlushInterval: number;
        recycleFreq: number;
        storageMode: 'memory' | 'localStorage' | 'sessionStorage';
        storageImpl: { setItem: Function, getItem: Function, removeItem: Function };
        disabled: boolean;
        storagePrefix: string;
        storeOnResolve: boolean;
        storeOnReject: boolean;
    }

    export interface IUtils {
        isNumber(value: any): boolean;
        isString(value: any): boolean;
        isObject(value: any): boolean;
        isFunction(value: any): boolean;
        fromJson(value: JSON): boolean;
        equals(a: any, b: any): boolean;
    }

    export interface IBinaryHeap {
        new (f: Function, g: Function): IBinaryHeap;
        // TODO
    }
}

declare module "cacheFactory" {
    export = cacheFactory;
}
