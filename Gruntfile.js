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
            },
            html: {
                files: ["www/**/*"],
                tasks: []
            }
        },
        
        modernizr: {
            dist: {
                devFile: 'www/modernizr-latest.js',
                outputFile: 'www/modernizr-custom.js',
                parseFiles: true,
                
                tests: ['touch', 'audio'],
                
                uglify: true,
                
                files: {
                    src: [
                        'www/**/*',
                        'sass/**/*'
                    ]
                }
            }
        },
        
        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 8000,
                    base: 'www/',
                    hostname: 'localhost'
                }
            }
        },
        
        concurrent: {
            app: {
                tasks: ['watch', 'connect']
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
    
    grunt.registerTask('dev', ['concurrent:app']);
    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'postcss']);
};
