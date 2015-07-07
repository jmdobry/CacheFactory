/*
 * cachefactory
 * http://jmdobry.github.io/cachefactory/
 *
 * Copyright (c) 2013-2015 Jason Dobry <http://jmdobry.github.io/cachefactory/>
 * Licensed under the MIT license. <https://github.com/jmdobry/cachefactory/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls'
  });
  require('time-grunt')(grunt);

  var webpack = require('webpack');
  var pkg = grunt.file.readJSON('package.json');
  var banner = 'cachefactory\n' +
    '@version ' + pkg.version + ' - Homepage <http://jmdobry.github.io/cachefactory/>\n' +
    '@author Jason Dobry <jason.dobry@gmail.com>\n' +
    '@copyright (c) 2013-2015 Jason Dobry \n' +
    '@license MIT <https://github.com/jmdobry/cachefactory/blob/master/LICENSE>\n' +
    '\n' +
    '@overview cachefactory is a very useful replacement for Angular\'s $cacheFactory.';

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: ['dist/'],
      coverage: ['coverage/']
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['build']
    },
    uglify: {
      main: {
        options: {
          report: 'min',
          sourceMap: true,
          sourceMapName: 'dist/cachefactory.min.map',
          banner: '/*!\n' +
          '* cachefactory\n' +
          '* @version <%= pkg.version %> - Homepage <http://jmdobry.github.io/cachefactory/>\n' +
          '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
          '* @copyright (c) 2013-2015 Jason Dobry <http://www.pseudobry.com>\n' +
          '* @license MIT <https://github.com/jmdobry/cachefactory/blob/master/LICENSE>\n' +
          '*\n' +
          '* @overview cachefactory is a very useful replacement for Angular\'s $cacheFactory.\n' +
          '*/\n'
        },
        files: {
          'dist/cachefactory.min.js': ['dist/cachefactory.js']
        }
      }
    },
    webpack: {
      dist: {
        entry: './src/index.js',
        output: {
          filename: './dist/cachefactory.js',
          libraryTarget: 'umd',
          library: 'CacheFactory'
        },
        module: {
          loaders: [
            {test: /(src)(.+)\.js$/, exclude: /node_modules/, loader: 'babel-loader?blacklist=useStrict'}
          ],
          preLoaders: [
            {
              test: /(src)(.+)\.js$|(test)(.+)\.js$/, // include .js files
              exclude: /node_modules/, // exclude any and all files in the node_modules folder
              loader: "jshint-loader?failOnHint=true"
            }
          ]
        },
        plugins: [
          new webpack.BannerPlugin(banner)
        ]
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dist: {},
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false
      },
      min: {
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        options: {
          files: [
            'node_modules/es6-promise/dist/es6-promise.js',
            'dist/cachefactory.min.js',
            './karma.start.js',
            'test/**/*.js'
          ]
        }
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.registerTask('test', ['build', 'karma:dist', 'karma:min']);
  grunt.registerTask('build', [
    'clean',
    'webpack',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

  grunt.registerTask('go', ['build', 'watch']);
};
