var grunt = require('grunt'),
    fs = require('fs'),
    path = require('path'),
    templates = fs.readdirSync(path.join(root.path, 'public/articles'));

grunt.loadNpmTasks('grunt-s3');

grunt.initConfig({
  blog: grunt.file.readJSON('config/blog.json'),
  s3: {
    options: {
      bucket: '<%= blog.bucket %>',
      access: 'public-read',
      headers: {
        // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
        "Cache-Control": "max-age=630720000, public",
        "Expires": new Date(Date.now() + 63072000000).toUTCString()
      },
      sync: templates.map(function(file) {
        return {
          src: file,
          dest: path.basename(file),
          verify: true
        }
      });
    }
  }
});

