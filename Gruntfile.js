// Generated on 2015-01-08 using generator-min 0.1.0

module.exports = function(grunt) {
    'use strict';
    
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        browserify: {
            prod: {
                src: 'www/app/app.js',
                dest: 'www/app/build.js',
                options: {
                    //alias: 'path-to-script.js:script-shortname',
                    browserifyOptions: {
                       basedir: './node_modules/'
                    }
                }
            }
        },
        
        jshint: {
            src: ['Gruntfile.js', 'www/app/**/*.js', '!www/app/build.js']
        },
        
        sass: {
            dev: {
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    sourcemap: 'auto',
                    style: 'compressed'
                },
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            }
        },
        
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 2 versions', 'ie 9']
                    })
                ]
            },
            dist: {
                src: 'www/css/style.css'
            }
        },
        
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass:dev', 'postcss']
            },
            scripts: {
                files: ['www/app/**/*.js', '!www/app/build.js'],
                tasks: ['jshint', 'browserify']
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'www/modernizr-latest.js',
                outputFile: 'www/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                tests: ['csstransforms'],
                
                uglify: true,
                
                files: {
                    src: [
                        'www/app/**/*',
                        'sass/**/*'
                    ]
                }
            }
        },
        
        imagemin: {
            build: {
                options: {
                    optimizationLevel: 2
                },
                files: [{
                    expand: true,
                    cwd: 'www/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'www/img/'
                }]
            }
        },
        
        'gh-pages': {
            options: {
                base: 'www',
                branch: 'master',
                repo: 'git@github.com:ceriwood/ceriwood.github.io.git'
            },
            src: ['**/*', '!app/**/*.js', 'app/build.js']
        }
    });
    
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'postcss', 'jshint', 'newer:imagemin', 'browserify', 'gh-pages']);
};
