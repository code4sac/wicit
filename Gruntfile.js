module.exports = function (grunt) {

    var env= process.env.NODE_ENV || 'development';
    var buildOptions = {
        development: {
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
        express: buildOptions[env].express,
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
                tasks: ['ngAnnotate', 'uglify:default', 'karma:unit']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            // The dev target can be run during development to have Karma continually running tests
            // while making changes to code/test
            dev: {
                configFile: 'karma.conf.js',
                singleRun: false
            }
        }
    });
  
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('build', ['ngAnnotate', 'uglify:default', 'sass']);
    grunt.registerTask('dev', ['build', 'watch']);
};