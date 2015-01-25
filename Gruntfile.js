/**
 * Simple S3 build script for pushing files to Amazon. Takes all files
 * in ./dist and uploads them to a configured S3 bucket. Use Amazon's
 * web interface to configure that bucket for public display, and you
 * got yourself a web site! Bonus points if you use CloudFront to
 * distribute these assets all over the world for ultra-fast render
 * times.
 */

module.exports = function(grunt) {
  var fs = require('fs'),
      path = require('path'),
      distPath = path.join(root.path, 'dist'),
      files = fs.readdirSync(distPath);

  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 's3']);

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js']
    },
    s3: {
      options: {
        bucket: process.env.AWS_S3_BUCKET_NAME,
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        },
        sync: files.map(function(file) {
          return {
            src: file,
            dest: path.basename(file),
            verify: true
          };
        });
      }
    }
  });
};
