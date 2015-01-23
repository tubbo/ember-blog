# Blog

Static blog application that compiles and pushes to Amazon S3.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) v0.10.x
* [PhantomJS](http://phantomjs.org/) (for development)

## Installation

* `git clone https://github.com/tubbo/blog.git`
* `cd blog`
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Usage

Mostly, the app doesn't need to be touched unless it's being developed
upon. To write articles, you can use a handy-dandy generator that is
provided. You can also run tests and deploy to S3.

### Writing a Post

`ember generate article {title}`

### Running Tests

* `npm test`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Make sure you have **$AWS_ACCESS_KEY_ID** and **$AWS_SECRET_ACCESS_KEY**
set in your environment, (as well as **$AWS_S3_BUCKET**), then run the
following command to deploy the static app to Amazon S3:

`npm deploy`

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* [Grunt](http://gruntjs.com)
* [Grunt S3](https://www.npmjs.com/package/grunt-s3)
* [Bower](http://bower.io)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

