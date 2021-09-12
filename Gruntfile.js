const { CheckerPlugin } = require('awesome-typescript-loader');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');
const swag = require('@ephox/swag');

module.exports = (grunt) => {
  const packageData = grunt.file.readJSON('package.json');
  const BUILD_VERSION = packageData.version + '-' + (process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : '0');
  const libPluginPath = 'lib/main/ts/Main.js';
  const libDemoPath = 'lib/demo/ts/Demo.js';
  const libHandwriting = 'lib/handwriting/ts/index.js'
  const scratchPluginPath = 'scratch/compiled/plugin.js';
  const scratchPluginMinPath = 'scratch/compiled/plugin.min.js';
  const tsDemoSourceFile = path.resolve('src/demo/ts/Demo.ts');
  const tsPluginoSourceFile = path.resolve('src/handwriting/ts/index.ts');
  const jsDemoDestFile = path.resolve('scratch/compiled/demo.js');
  const handwritingFile = 'scratch/compiled/handwriting.js';
  const demoFile = 'scratch/compiled/demo.js';

  grunt.initConfig({
    pkg: packageData,

    clean: {
      dirs: [ 'dist', 'scratch' ]
    },

    eslint: {
      options: {
        fix: grunt.option('fix')
      },
      plugin: [ 'src/**/*.ts' ]
    },

    shell: {
      command: 'tsc'
    },

    rollup: {
      options: {
        treeshake: true,
        format: 'iife',
        onwarn: swag.onwarn,
        plugins: [
          swag.nodeResolve({
            basedir: __dirname,
            prefixes: {}
          }),
          swag.remapImports()
        ]
      },
      plugin: {
        files: [
          {
            src: libHandwriting,
            dest: handwritingFile
          }
        ]
      },
      plugin1: {
        files: [
          {
            src: libPluginPath,
            dest: scratchPluginPath
          }
        ]
      },
      plugin2: {
        files: [
          {
            src: libDemoPath,
            dest: demoFile
          }
        ]
      }
    },

    uglify: {
      plugin: {
        files: [
          {
            src: scratchPluginPath,
            dest: scratchPluginMinPath
          }
        ]
      }
    },

    concat: {
      license: {
        options: {
          process: (src) => {
            const buildSuffix = process.env.BUILD_NUMBER
              ? '-' + process.env.BUILD_NUMBER
              : '';
            return src.replace(
              /@BUILD_NUMBER@/g,
              packageData.version + buildSuffix
            );
          }
        },
        // scratchPluginMinPath is used twice on purpose, all outputs will be minified for premium plugins
        files: {
          'dist/handwritingplugin/plugin.js': [
            'src/text/license-header.js',
            scratchPluginMinPath
          ],
          'dist/handwritingplugin/plugin.min.js': [
            'src/text/license-header.js',
            scratchPluginMinPath
          ],
          'dist/handwritingplugin/handwriting/handwriting.js': [
            'src/text/license-header.js',
            handwritingFile
          ],
          'dist/handwritingplugin/demo/demo.js': [
            'src/text/license-header.js',
            jsDemoDestFile
          ]
        }
      }
    },

    copy: {
      css: {
        files: [
          { src: [ 'CHANGELOG.txt', 'LICENSE.txt' ], dest: 'dist/handwritingplugin', expand: true }
        ]
      }
    },

    replace: {
      demo: {
        options: {
          patterns: [
            {
              match: /..\/..\/scratch\/compiled\/demo.js/g,
              replacement: './demo.js'
            },
            {
              match: /..\/..\/node_modules\/tinymce\/tinymce.js/g,
              replacement: '../../../node_modules/tinymce/tinymce.js'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'src/demo/',
            src: ['index.html'], 
            dest: 'dist/handwritingplugin/demo'
          }
        ]
      },
      handwriting: {
        options: {
          patterns: [
            {
              match: /..\/..\/scratch\/compiled\/handwriting.js/g,
              replacement: './handwriting.js'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'src/handwriting/',
            src: ['index.html'], 
            dest: 'dist/handwritingplugin/handwriting'
          }
        ]
      }
    },

    webpack: {
      options: {
        mode: 'development',
        watch: true
      },
      dev: {
        entry: () => {
          return new Promise((resolve)=>{
            resolve({
               demo:tsDemoSourceFile,
               handwriting:tsPluginoSourceFile,
            });
          });
        },
        devtool: 'source-map',

        resolve: {
          extensions: [ '.ts', '.js' ]
        },

        module: {
          rules: [
            {
              test: /\.ts$/,
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    transpileOnly: true,
                    experimentalWatchApi: true
                  }
                }
              ]
            }
          ]
        },

        plugins: [ new LiveReloadPlugin(), new CheckerPlugin() ],

        output: {
          filename: '[name].js',
          path: path.dirname(jsDemoDestFile)
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('@ephox/swag');

  grunt.registerTask('version', 'Creates a version file', () => {
    grunt.file.write('dist/handwritingplugin/version.txt', BUILD_VERSION);
  });

  grunt.registerTask('default', [
    'clean',
    'eslint',
    'shell',
    'rollup',
    'uglify',
    'concat',
    'copy',
    'replace',
    'version'
  ]);
};
