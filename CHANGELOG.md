##### 3.0.0 - 26 February 2017

###### Breaking changes
- #29 by @Delagen - TypeScript definitions have been rewritten, and the `CacheFactory` constructor function is now a named export of the module.

    Before:

        import CacheFactory from 'cachefactory';

    After:

        import { CacheFactory } from 'cachefactory';

##### 2.0.0 - 17 September 2016

###### Breaking changes
- #20 - The `CacheFactory` function is now a contructor function that produces instances of `CacheFactory` when invoked with `new`
- `CacheFactory#createCache` is now the only way to create a cache
- `CacheFactory#get` now throws an error if the specified cache does not exist
  - You can use `CacheFactory#exists to check if a cache exists
- Switched from `Cache#disabled` to `Cache#enabled`

###### Backwards compatible changes
- Upgraded some dependencies
- Added `CacheFactory#exists`
- #9 - Added JSDoc comments and API Reference Documentation

##### 1.5.1 - 29 April 2016

###### Backwards compatible changes
- Added `jsnext:main`

##### 1.5.0 - 29 April 2016

###### Backwards compatible changes
- Switched to Rollup.js
- Improve import of `yabh`

##### 1.4.1 - 05 April 2016

###### Backwards compatible changes
- Added TypeScript definition file (thanks @SamuelMarks)

###### Other
- Upgraded devDependencies

##### 1.4.0 - 21 January 2016

###### Backwards compatible API changes
- Add a `values()` method to cache instances

###### Bug fixes
- Fixed "expires" sometimes getting set to null
- Fixed cache not re-initializing properly from localStorage
- #3 - Initialization resets access timestamps

##### 1.3.0 - 30 December 2015

###### Bug fixes
- #1 - Really fixed this time

##### 1.2.0 - 12 October 2015

###### Backwards compatible API changes
- #2 - Specify MaxAge on put

###### Bug fixes
- #1 - After reinitializing a cache from localStorage, info().size returns 0

##### 1.1.0 - 10 July 2015

Upgraded dependencies

##### 1.0.2 - 06 July 2015

Fix for promises

##### 1.0.0 - 06 July 2015

Initial release
