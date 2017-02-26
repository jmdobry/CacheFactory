module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/es6-promise/dist/es6-promise.auto.js',
      'src/utils.js',
      'src/defaults.js',
      'src/BinaryHeap.js',
      'src/Cache.js',
      'src/CacheFactory.js',
      'src/index.js',
      'test/_setup.js',
      'test/**/*.test.js'
    ],
    captureTimeout: 60000,
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    plugins: [
      'karma-sourcemap-loader',
      'karma-babel-preprocessor',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-coverage'
    ],
    runnerPort: 9100,
    singleRun: true,
    autoWatch: false,
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    preprocessors: {
      'node_modules/yabh/src/index.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage', 'sourcemap'],
      'karma.start.js': ['babel'],
      'test/**/*.js': ['babel', 'sourcemap']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: [
          'transform-es2015-modules-umd'
        ],
        sourceMap: 'inline'
      }
    },
    reporters: ['progress', 'coverage']
  })
}
