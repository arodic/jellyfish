(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.initConfig({

      copy: {
        'gh-pages': {
          files: [
            {src: '*-*.html', dest: 'gh-pages/'},
            {src: '*-*.css', dest: 'gh-pages/'},
            {src: '*-*.js', dest: 'gh-pages/'},
            {src: 'LICENSE', dest: 'gh-pages/LICENSE'},
            {src: 'README.md', dest: 'gh-pages/README.md'},
            {src: 'preview.png', dest: 'gh-pages/preview.png'},
            {src: 'index.html', dest: 'gh-pages/index.html'},
          ]
        }
      },
      'gh-pages': {
        'gh-pages': {
          options: {
            base: 'gh-pages',
            branch: 'gh-pages',
            message: 'auto-updating gh-pages from dev with grunt'
          },
          src: '**/*'
        }
      },

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', [
      'copy:gh-pages',
      'gh-pages:gh-pages'
    ]);

  };

}());
