// Generated on 2015-01-08 using generator-min 0.1.0

module.exports = function(grunt) {
    'use strict';
    
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
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
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'www/modernizr-latest.js',
                outputFile: 'www/modernizr-custom.js',
                
                extra: {
                    load: false
                },
                
                tests: ['touch', 'audio'],
                
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
            src: ['**/*']
        }
    });
    
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'postcss', 'gh-pages']);
};
