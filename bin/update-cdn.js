/**
 * Connect to CloudFront and invalidate all files.
 *
 * @module psychedelica
 * @requires fs
 * @requires glob
 * @requires aws
 */

var fs = require('fs'),
    glob = require('glob'),
    AWS = require('aws-sdk'),
    cloudfront = new AWS.CloudFront();

glob('dist/**', function(error, files) {
  if (error) { throw error; }

  var paths = files.splice(1, files.length).map(function(file) {
    return file.split('dist/').join('');
  });

  var invalidation = {
    DistributionId: process.env.AWS_CLOUDFRONT_DISTRO_ID,
    InvalidationBatch: {
      CallerReference: new Date().valueOf().toString(),
      Paths: {
        Quantity: paths.length,
        Items: paths
      }
    }
  };

  cloudfront.createInvalidation(invalidation, function(error, data) {
    if (error) { throw error; }
    console.log("Invalidated", paths.length, "files on CloudFront.");
  });
});
