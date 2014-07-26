module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "bower-install-simple": {
      dev: {
        options: {
          color:       true,
          production:  false,
          directory:   'public/components'
        }
      },
      prod: {
        options: {
          color:       true,
          production:  true,
          directory:   'public/components'
        }
      }
    },
    express: {
      custom: {
        options: {
          port: 3000,
          bases: 'public',
          server: 'app.js'
        }
      }
    },
    sass: {
      dist: {
        files: {
          'public/stylesheets/style.css' : 'public/stylesheets/style.scss'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks("grunt-bower-install-simple");
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build-dev', ['npm-install', 'bower-install-simple:dev']);
  grunt.registerTask('build-prod', ['npm-install', 'bower-install-simple:prod']);
  grunt.registerTask('dev', ['express', 'watch', 'express-keepalive']);
}