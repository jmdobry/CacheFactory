module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    files: [
      'node_modules/es6-promise/dist/es6-promise.js',
      'dist/cachefactory.js',
      './karma.start.js',
      'test/**/*.js'
    ],
    captureTimeout: 60000,
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-coverage'
    ],
    runnerPort: 9100,
    singleRun: true,
    autoWatch: false,
    //coverageReporter: {
    //  type: 'lcov',
    //  dir: 'coverage/'
    //},
    //preprocessors: {
    //  'dist/cachefactory.js': ['coverage']
    //},
    //reporters: ['progress', 'coverage']
  });
};
