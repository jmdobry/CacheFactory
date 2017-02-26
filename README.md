# CacheFactory [![Bower][1]][2] [![NPM][3]][4] [![Tests][5]][6] [![Downloads][7]][8] [![Coverage][9]][10]

CacheFactory is a very simple and useful synchronous key-value store for the
browser.

## Table of Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [The Basics](http://www.pseudobry.com/CacheFactory/latest/tutorial-basics.html)
* [Working with a cache](http://www.pseudobry.com/CacheFactory/latest/tutorial-working-with-a-cache.html)
* [Working with localStorage](http://www.pseudobry.com/CacheFactory/latest/tutorial-working-with-localstorage.html)

## Installation

### NPM

```
npm install --save cachefactory
```

### Bower

```
bower install --save cachefactory
```

## Quick Start

```js
import {CacheFactory} from 'cachefactory';

const cacheFactory = new CacheFactory();
let cache;

if (!cacheFactory.exists('my-cache')) {
  cache = cacheFactory.createCache('my-cache', {
    // Delete items from the cache when they expire
    deleteOnExpire: 'aggressive',

    // Check for expired items every 60 seconds
    recycleFreq: 60 * 1000
  });
}

cache.put('/books/1', { title: 'BookOne', id: 1 });
```

## Documentation

* [The Basics](http://www.pseudobry.com/CacheFactory/latest/tutorial-basics.html)
* [Working with a cache](http://www.pseudobry.com/CacheFactory/latest/tutorial-working-with-a-cache.html)
* [Working with localStorage](http://www.pseudobry.com/CacheFactory/latest/tutorial-working-with-localstorage.html)
* [API Reference Documentation](http://www.pseudobry.com/CacheFactory)

### License

[MIT License][11]

Copyright (C) 2015-2016 CacheFactory project authors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: https://img.shields.io/bower/v/cachefactory.svg?style=flat
[2]: https://github.com/jmdobry/CacheFactory
[3]: https://img.shields.io/npm/v/cachefactory.svg?style=flat
[4]: https://www.npmjs.org/package/cachefactory
[5]: https://img.shields.io/circleci/project/jmdobry/CacheFactory/master.svg?style=flat
[6]: https://circleci.com/gh/jmdobry/cachefactory/tree/master
[7]: https://img.shields.io/npm/dm/cachefactory.svg?style=flat
[8]: https://www.npmjs.org/package/cachefactory
[9]: https://img.shields.io/codecov/c/github/jmdobry/CacheFactory.svg
[10]: https://codecov.io/gh/jmdobry/CacheFactory
[11]: https://github.com/jmdobry/CacheFactory/blob/master/LICENSE
