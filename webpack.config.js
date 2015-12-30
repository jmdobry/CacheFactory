var webpack = require('webpack');
var pkg = JSON.parse(require('fs').readFileSync('package.json'));
var banner = 'cachefactory\n' +
  '@version ' + pkg.version + ' - Homepage <http://jmdobry.github.io/cachefactory/>\n' +
  '@author Jason Dobry <jason.dobry@gmail.com>\n' +
  '@copyright (c) 2013-2016 Jason Dobry \n' +
  '@license MIT <https://github.com/jmdobry/cachefactory/blob/master/LICENSE>\n' +
  '\n' +
  '@overview cachefactory is a very useful replacement for Angular\'s $cacheFactory.';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/cachefactory.js',
    libraryTarget: 'umd',
    library: 'CacheFactory'
  },
  module: {
    loaders: [
      {
        test: /(src)(.+)\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
};
