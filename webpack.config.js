var webpack = require('webpack');
var pkg = JSON.parse(require('fs').readFileSync('package.json'));
var banner = 'cachefactory\n' +
  '@version ' + pkg.version + ' - Homepage <https://github.com/jmdobry/CacheFactory>\n' +
  '@author Jason Dobry <jason.dobry@gmail.com>\n' +
  '@copyright (c) 2013-2016 Jason Dobry \n' +
  '@license MIT <https://github.com/jmdobry/CacheFactory/blob/master/LICENSE>\n' +
  '\n' +
  '@overview CacheFactory is a very simple and useful cache for the browser.';

module.exports = {
  devtool: 'source-map',
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
