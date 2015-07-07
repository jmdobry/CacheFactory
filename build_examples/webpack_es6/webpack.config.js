module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'cachefactory': '../../dist/cachefactory.js'
    }
  },
  module: {
    loaders: [
      { test: /(.+)\.js$/, loader: 'babel-loader?blacklist=useStrict' }
    ]
  }
};
