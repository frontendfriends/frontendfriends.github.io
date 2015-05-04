/**
* @file Gruntfile
* @version 1.0.0
* @author {@link https://github.com/furzeface Daniel Furze}
*/
module.exports = function(grunt) {
  'use strict';
  /* jshint camelcase: false */

  // Reads package.json and dynamically loads all Grunt tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies', pattern: ['assemble', 'assemble-*', 'grunt-*']});
  // Time all of the things
  require('time-grunt')(grunt);
  // Go!
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> :: Latest build: <%= grunt.template.today(\'dd/mm/yyyy, h:MM:ss TT\') %> */\n'
    },
    config: {
      // Src settings
      srcStyles: 'styles/src',
      mainSass: 'main.scss',
      // Dist settings
      distStyles: 'styles/dist',
      mainCss: 'fefc.css',
      // Project settings
      gruntfile: 'Gruntfile.js'
    },

    // Watchers
    watch: {
      gruntfile: {
        files: [
        '<%= config.gruntfile %>'
        ],
        tasks: [
        'scripts'
        ]
      },
      styles: {
        files: [
        '<%= config.srcStyles %>/**/*.scss'
        ],
        tasks: [
        'styles'
        ]
      }
    },


    // Style tasks
    sass: {
      main: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= config.distStyles %>/<%= config.mainCss %>': '<%= config.srcStyles %>/<%= config.mainSass %>'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
        'last 2 version'
        ]
      },
      main: {
        expand: true,
        flatten: true,
        src: '<%= config.distStyles %>/<%= config.mainCss %>',
        dest: '<%= config.distStyles %>/'
      }
    },

    combine_mq: {
      main: {
        expand: true,
        cwd: '<%= config.distStyles %>/',
        src: ['<%= config.mainCss %>'],
        dest: '<%= config.distStyles %>/'
      }
    },

    px_to_rem: {
      main: {
        options: {
          base: 16,
          fallback: false,
          fallback_existing_rem: false,
          ignore: []
        },
        files: [
        {
          expand: true,
          flatten: true,
          src: '<%= config.distStyles %>/<%= config.mainCss %>',
          dest: '<%= config.distStyles %>/'
        }
        ]
      }
    },

    cssmin: {
      options: {
        banner: '<%= meta.banner %>',
        noAdvanced: true
      },
      main: {
        src: '<%= config.distStyles %>/<%= config.mainCss %>',
        dest: '<%= config.distStyles %>/<%= config.mainCss %>',
      }
    },


    // Script tasks
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
      '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/**/*.js'
      ],
      gruntfile: [
      '<%= config.gruntfile %>'
      ]
    }
  });

  // Build tasks.
  grunt.registerTask('styles', [
    'sass',
    'newer:autoprefixer',
    'newer:combine_mq',
    'newer:px_to_rem'
    ]);

  grunt.registerTask('scripts', [
    'newer:jshint'
    ]);

  // Task aliases.
  grunt.registerTask('build', [
    'styles',
    'scripts'
    ]);

  grunt.registerTask('build_production', [
    'styles',
    'cssmin',
    'scripts'
    ]);

  // Default task.
  grunt.registerTask('default', [
    'build',
    'watch'
    ]);
};
