var path = require('path');

module.exports = function(grunt) {
  console.log('==================================');
  //console.log('in gruntfile; package: ', grunt.package);
  console.log('cwd: ' + process.cwd());
  console.log('grunt.file: ', grunt);
  console.log('==================================');
  //console.log('')
  console.log('exists? ', grunt.file.exists('gruntfiles', 'main.js'));
  console.log('resolved? ', path.resolve('..', 'gruntfiles', 'main.js'));
  console.log('==================================');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/* Hey there */\n'
      },
      build: {
        src: 'dummy.js',
        dest: 'dummy.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};