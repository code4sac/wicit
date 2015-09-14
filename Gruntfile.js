module.exports = function (grunt) {

    var env= process.env.NODE_ENV || 'dev'

    var buildOptions = {
        dev: {
            sass: {
                style: 'compressed'
            },
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
            default: {
                options: {
                    port: 3000,
                    script: 'app.js',
                    node_env: env
                }
            }
        },
        sass: {
            options: buildOptions[env].sass,
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
            default: {
                options: buildOptions[env].uglify,
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
                tasks: ['ngAnnotate', 'uglify:default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('build', ['ngAnnotate', 'uglify:default', 'sass']);
    grunt.registerTask('server', ['build', 'express:default']);
    grunt.registerTask('dev', ['build', 'watch']);
};