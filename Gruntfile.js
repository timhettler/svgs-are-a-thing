module.exports = function ( grunt ) {
// Loads in any grunt tasks in the package.json file
require('load-grunt-tasks')(grunt);

// App-specific configuration data
var appConfig = require( './app.config.js' );

var taskConfig = {

    // HTML Builder
    // Appends scripts and styles, Removes debug parts, append html partials, Template options
    // https://github.com/spatools/grunt-html-build
    htmlbuild: {
        build: {
            src: ['src/*.html'],
            dest: '<%= build_dir %>',
            options: {
                parseTag: 'build',
                beautify: true,
                relative: true,
                scripts: {
                    // Modernizr needs to go in HEAD
                    modernizr: ['<%= build_dir %>/vendor/modernizr.js'],
                    // Define order-dependent files first, then glob
                    vendor: [
                        '<%= build_dir %>/vendor/zepto.js',
                        '<%= build_dir %>/vendor/**/*.js',
                        '!**/modernizr.js'
                    ],
                    // Project-specific files
                    app: [
                        '<%= build_dir %>/js/<%= app_files.main %>',
                        '<%= build_dir %>/js/**/*.js',
                        '<%= html2js.app.dest %>'
                    ]

                },
                styles: {
                    vendor: [
                        '<%= build_dir %>/vendor/**/*.css'
                    ],
                    app: [
                        '<%= build_dir %>/css/**/*.css'
                    ]
                },
                sections: {
                    slides: 'src/slides/*.html'
                },
                // Project meta-data (defined in './app.config.js')
                data: {
                    title: '<%= meta.title %>',
                    description: '<%= meta.description %>',
                    viewport: '<%= meta.viewport %>'
                },
            }
        }
    },

    // Clean
    // Clean files and folders.
    // https://github.com/gruntjs/grunt-contrib-clean
    clean: {
        build: [
            '<%= build_dir %>'
        ]
    },

    // grunt-ng-annotate
    // Add, remove and rebuild angularjs dependency injection annotations
    // https://github.com/mzgol/grunt-ng-annotate
    ngAnnotate: {
        options: {
            singleQuotes: true,
        },
        build: {
            files: [{
                src: [ 'js/**/*.js' ],
                cwd: '<%= build_dir %>',
                dest: '<%= build_dir %>',
                expand: true
            }]
        }
    },

    // HTML2JS
    // Converts AngularJS templates to JavaScript
    // https://github.com/karlgoldstein/grunt-html2js
    html2js: {
        options: { quoteChar: '\'' },
        app: {
            src: [ '<%= app_files.atpl %>' ],
            dest: '<%= build_dir %>/js/templates-app.js'
        }
    },

    // JS Hint
    // You know it, you hate it. Validate files with JSHint.
    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
        // http://www.jshint.com/docs/options/
        options: {
            camelcase: true,
            eqeqeq: true,
            eqnull: true,
            indent: 4,
            latedef: true,
            newcap: true,
            quotmark: 'single',
            trailing: true,
            // undef: true,
            curly: true,
            immed: true,
            noarg: true,
            sub: true,
            browser: true,
            devel: true,
            debug: true,
            globals: {
                angular: true
            }
        },
        build: '<%= app_files.js %>',
        gruntfile: {
            options : {
                camelcase: false,
                node: true
            },
            files: {
                src: ['Gruntfile.js']
            }
        }
    },

    // grunt-contrib-watch
    // Run tasks whenever watched files change.
    // https://github.com/gruntjs/grunt-contrib-watch
    watch: {

        app_config: {
            files: 'app.config.js',
            tasks: [ 'build' ],
        },

        gruntfile: {
            files: 'Gruntfile.js',
            tasks: [ 'jshint:gruntfile', 'build' ]
        },

        js_src: {
            options: {
              livereload: true
            },
            files: ['<%= app_files.js %>'],
            tasks: [ 'jshint:build', 'newer:copy:build_appjs' ]
        },

        assets: {
            options: {
              livereload: true
            },
            files: ['src/assets/**/*'],
            tasks: [ 'newer:copy:build_assets' ]
        },

        svg: {
            options: {
              livereload: true
            },
            files: ['src/assets/svg/*.svg'],
            tasks: [ 'svgstore:dev' ]
        },

        html: {
            options: {
              livereload: true
            },
            files: [ '<%= app_files.html %>' ],
            tasks: [ 'htmlbuild:build' ]
        },

        sass: {
            options: {
              livereload: true
            },
            files: [ '<%= app_files.styles %>' ],
            tasks: [ 'sass:build', 'autoprefixer:build' ]
        }
    },

    // Sass
    // Compile Sass to CSS (with libsass)
    // https://github.com/sindresorhus/grunt-sass
    sass: {
        build: {
            options: {
                'sourcemap': true,
                'includePaths': ['vendor']
            },
            files: [{
                expand: true,
                cwd: 'src/sass/',
                src: ['**/*.scss'],
                dest: '<%= build_dir %>/css/',
                ext: '.css'
            }]
        }
    },

    // Autoprefixer
    // Parses CSS and adds vendor-prefixed CSS properties using the Can I Use database.
    // https://github.com/nDmitry/grunt-autoprefixer
    autoprefixer: {
        options: {
            map: true, // Use and update the sourcemap
            browsers: ['last 2 versions', 'ie 9']
        },
        build: {
            src: '<%= build_dir %>/css/**/*.css',
        }
    },

    // Copy
    // Copy files and folders.
    // https://github.com/gruntjs/grunt-contrib-copy
    copy: {
      build_assets: {
        files: [
            {
                src: [ '!svg/**', '**' ],
                dest: '<%= build_dir %>/assets/',
                cwd: 'src/assets',
                expand: true
            }
       ]
      },
      build_appjs: {
        files: [
            {
                src: [ '**' ],
                dest: '<%= build_dir %>/js',
                cwd: 'src/js',
                expand: true
            }
        ]
      },
      build_vendor: {
        files: [
            {
                src: '<%= vendor_files.js %>',
                dest: '<%= build_dir %>/vendor',
                expand: true,
                flatten: true
            },
            {
                src: '<%= vendor_files.css %>',
                dest: '<%= build_dir %>/vendor',
                expand: true,
                flatten: true
            }
        ]
      }
    },

    // ImageMin
    // Minify PNG, JPEG and GIF images
    // https://github.com/gruntjs/grunt-contrib-imagemin
    imagemin: {
        compile: {
            files: [{
                expand: true,
                cwd: 'src/assets',
                src: ['**/*.{png,jpg,gif,svg}']
            }]
        }
    },

    // Connect
    // Start a static web server
    // https://github.com/gruntjs/grunt-contrib-connect
    connect : {
        options: {
          port: 9000,
          livereload: 35729,
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost'
        },
        livereload: {
          options: {
            open: true,
            base: [
              '<%= build_dir %>'
            ]
          }
        }
    },

    // SVG Store
    // Merge svgs from a folder
    // https://github.com/FWeinb/grunt-svgstore
    svgstore: {
        options: {
            prefix : 'icon-',
            cleanup: ['fill'],
            svg: {
                style : 'width:0;height:0;visibility:hidden;'
            }
        },
        dev: {
            files: {
                '<%= build_dir %>/assets/svg/icons.svg': ['src/assets/svg/*.svg'],
            },
        },
    },

    // Git Hooks
    // A Grunt plugin to help bind Grunt tasks to Git hooks
    // https://github.com/wecodemore/grunt-githooks
    githooks: {
        all: {
            'pre-commit': 'jshint:build'
        }
    }
};

grunt.initConfig( grunt.util._.extend( taskConfig, appConfig ) );

grunt.registerTask( 'server', [ 'githooks', 'build', 'connect:livereload', 'watch' ] );
grunt.registerTask( 'ncserver', [ 'noclean', 'connect:dev', 'watch' ] );
grunt.registerTask( 'noserver', [ 'build', 'watch' ] );
grunt.registerTask( 'default', [ 'server' ] );

grunt.registerTask('build', [
    'clean:build', 'jshint:build',
    'svgstore',
    'copy:build_assets', 'copy:build_appjs', 'copy:build_vendor',
    'sass:build', 'autoprefixer:build', 'htmlbuild:build'
]);


};
