/**
 * Grunt is used to build and deploy the application after a successful
 * test run. It shells out to build the app via Ember CLI, then uses the
 * aws_s3 plugin task to synchronize all files in ./dist with the
 * configured bucket on Amazon S3. Simply running `grunt` will make all
 * of this happen, as well as lint the entire app tree with jshint.
 */

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-broccoli');

  grunt.registerTask('default', [
      'jshint',
      'broccoli:app:build',
      'aws_s3'
  ]);

  grunt.initConfig({
    broccoli: {
      app: {
        dest: 'dist',
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        esnext: true
      },
      files: [
        'app/**/*.js',
        'blueprints/**/*.js',
        'config/**/*.js',
        'lib/**/*.js',
        '*file.js',
        'tests/**/*.js'
      ]
    },
    aws_s3: {
      options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      production: {
        options: {
          bucket: process.env.AWS_S3_BUCKET_NAME,
          differential: true
        },
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: ['**'],
            dest: '',
            action: 'upload'
          }
        ]
      }
    }
  });
};
