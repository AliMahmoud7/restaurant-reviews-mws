module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'gm',
          sizes: [{
            width: 400,
            suffix: '_1x',
            quality: 40
          },{
            width: 400,
            suffix: '_2x',
            quality: 60
          },{
            width: 800,
            suffix: '_1x',
            quality: 40
          },{
            width: 800,
            suffix: '_2x',
            quality: 60
          }]
        },
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      }
    },
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.registerTask('default', ['responsive_images']);

};
