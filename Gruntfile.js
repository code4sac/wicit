module.exports = function (grunt) {

    var buildOptions = {
        dev: {
            uglify: {
                sourceMap: true,
                compress: {
                    drop_debugger: false
                },
                mangle: false
            }
        },
        production: {
            sass: {
                style: 'compressed'
            },
            uglify: {
                compress: {
                    drop_console: true
                }
            }
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            dev: {
                options: {
                    port: 3000,
                    script: 'app.js'
                }
            },
            prod: {
                options: {
                    port: 3000,
                    script: 'app.js',
                    node_env: 'production'
                }
            }
        },
        sass: {
            options: buildOptions.production.sass,
            dist: {
                files: {
                    'public/stylesheets/style.min.css': 'public/stylesheets/style.scss'
                }
            }
        },
        ngAnnotate: {
            dist: {
                files: {
                    'public/javascripts/app.min.js': [
                        'public/javascripts/app.js',
                        'public/javascripts/controllers/*.js',
                        'public/javascripts/services/*.js'
                    ]
                }
            }
        },
        uglify: {
            dev: {
                options: buildOptions.dev.uglify,
                files: {
                    'public/javascripts/app.min.js': 'public/javascripts/app.min.js'
                }
            },
            prod: {
                options: buildOptions.production.uglify,
                files: {
                    'public/javascripts/app.min.js': 'public/javascripts/app.min.js'
                }
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: ['public/javascripts/controllers/*.js', 'public/javascripts/services/*.js', 'app.js'],
                tasks: ['ngAnnotate', 'uglify:dev']
            },
            express: {
                files: ['app.js', 'routes/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('build:dev', ['ngAnnotate', 'uglify:dev', 'sass']);
    grunt.registerTask('build:prod', ['ngAnnotate', 'uglify:prod', 'sass']);
    grunt.registerTask('dev', ['build:dev', 'express:dev', 'watch']);
    grunt.registerTask('prod', ['build:prod', 'express:prod', 'watch']);
};