var babel = require('rollup-plugin-babel')
var pkg = require('./package.json')

module.exports = {
  moduleName: 'CacheFactory',
  moduleId: 'cachefactory',
  banner: '/**\n' +
  ' * CacheFactory\n' +
  ' * @version ' + pkg.version + ' - Homepage <https://github.com/jmdobry/CacheFactory>\n' +
  ' * @copyright (c) 2015-2016 CacheFactory project authors\n' +
  ' * @license MIT <https://github.com/jmdobry/CacheFactory/blob/master/LICENSE>\n' +
  ' * @overview CacheFactory is a very simple and useful cache for the browser.\n' +
  ' */',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        'es2015-rollup'
      ]
    })
  ]
}
