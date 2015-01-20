// Generated on 2015-01-08 using generator-min 0.1.0

module.exports = function(grunt) {
    'use strict';
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-newer');
    
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
                    'www/css/shared.css': 'sass/shared.scss',
                    'www/css/ceriwood.css': 'sass/ceriwood.scss',
                    'www/css/music.css': 'sass/music.scss',
                    'www/css/photography.css': 'sass/photography.scss'
                }
            },
            prod: {
                options: {
                    sourcemap: 'auto',
                    style: 'compressed'
                },
                files: {
                    'www/css/shared.css': 'sass/shared.scss',
                    'www/css/ceriwood.css': 'sass/ceriwood.scss',
                    'www/css/music.css': 'sass/music.scss',
                    'www/css/photography.css': 'sass/photography.scss'
                }
            }
        },
        
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass:dev']
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
            src: ['**/*', '!app/**/*.js']
        }
    });
    
    grunt.registerTask('default', ['modernizr', 'sass:prod', 'jshint', 'newer:imagemin', 'browserify', 'gh-pages']);
};
