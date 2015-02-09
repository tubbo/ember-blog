/**
 * Deployment configuration, use `npm run-script deploy` to upload the app to S3.
 */

module.exports = {
  assets: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    region: 'us-east-1',
    filePattern: '**/*.{js,css,html,json}'
  }
};
