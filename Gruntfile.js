module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        browserify: {
            app: {
                options: {
                    transform: [
                        ['babelify', {presets: ['es2015', 'react']}]
                    ]
                },
                src: 'www/js/app.js',
                dest: 'www/js/app.min.js'
            }
        },
        
        sass: {
            dev: {
                files: {
                    'www/css/style.css': 'sass/style.scss'
                }
            },
            prod: {
                options: {
                    sourcemap: true,
                    outputStyle: 'compressed'
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
            
            js: {
                files: ['www/js/**/*.js', '!www/js/app.min.js'],
                tasks: ['browserify']
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
                    hostname: '0.0.0.0'
                }
            }
        },
        
        'gh-pages': {
            options: {
                base: 'www',
                branch: 'master',
                repo: 'git@github.com:ceriwood/ceriwood.github.io.git'
            },
            src: ['**/*']
        },
        
        uglify: {
            options: {
                mangle: false
            },
            prod: {
                files: {
                    'www/js/app.min.js': ['www/js/app.min.js']
                }
            }
        },
        
        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch', 'connect']
            },
            build1: {
                tasks: ['sass:prod', 'browserify']
            },
            build2: {
                tasks: ['postcss', 'uglify']
            }
        }
    });
    
    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('default', ['modernizr', 'concurrent:build1', 'concurrent:build2']);
    grunt.registerTask('deploy', ['gh-pages']);
};
