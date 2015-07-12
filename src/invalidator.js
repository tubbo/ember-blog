import invalidate from 'invalidatejs';
import glob from 'glob';

/**
 * A script for invalidating the CloudFront CDN cache automatically
 * after deployment.
 */

glob('dist/**/*', function(error, files) {
  if (error) { throw error; }

  let distribution = {
    resourcePaths: files,
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    dist: process.env.AWS_CLOUDFRONT_DISTRO_ID
  };

  invalidate(distribution, function(error, statusCode, response) {
    if (error) {
      console.error(error, statusCode, response.Error.Message);
    }
  });
});
