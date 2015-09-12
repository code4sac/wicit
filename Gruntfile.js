module.exports = function(grunt) {
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
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/stylesheets/style.min.css' : 'public/stylesheets/style.scss'
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
      dist: {
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
      express: {
        files:  [ 'app.js', 'routes/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('build-dev', ['npm-install']);
  grunt.registerTask('dev', ['express:dev', 'watch']);
  grunt.registerTask('prod', ['ngAnnotate', 'uglify', 'express:prod', 'watch']);
}