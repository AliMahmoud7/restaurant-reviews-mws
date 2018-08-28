module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'gm',
          sizes: [{
            width: 400,
            suffix: '_1x',
            quality: 30
          },{
            width: 400,
            suffix: '_2x',
            quality: 60
          },{
            width: 800,
            suffix: '_1x',
            quality: 30
          },{
            width: 800,
            suffix: '_2x',
            quality: 60
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/original/',
          dest: 'img/'
        }]
      }
    },
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.registerTask('default', ['responsive_images']);

};
