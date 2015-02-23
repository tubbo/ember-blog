# psychedeli.ca

The web application which powers my blog & personal site. It combines a
long-living [Ember.js][ember] application with a static HTML
compilation system, which allows the app to be hosted and distributed
across the world for pennies using [Amazon Web Services][aws] (namely
S3 and CloudFront).

[![Build Status](https://travis-ci.org/tubbo/blog.svg)](https://travis-ci.org/tubbo/blog)
[![Code Climate](https://codeclimate.com/github/tubbo/blog/badges/gpa.svg)](https://codeclimate.com/github/tubbo/blog)
[![Test Coverage](https://codeclimate.com/github/tubbo/blog/badges/coverage.svg)](https://codeclimate.com/github/tubbo/blog)

## Prerequisites

You will need the following things properly installed on your computer:

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) v0.10.x or above
* [PhantomJS](http://phantomjs.org/) (for testing)

## Installation

Just clone down this repo and install with NPM:

```bash
git clone https://github.com/tubbo/blog.git
cd blog
npm install
```

## Usage

Run the following command to start the development server:

```bash
$ npm start
```

### Running Tests

Tests are written with QUnit and run with Testem. Phantom.JS is also
required to run tests within the console.

To run tests:

```bash
$ npm test
```

### Building

You can build the static app yourself, by default it will use the
**development** environment:

```bash
$ ember build [--environment=production]
```

### Deploying

Make sure you have **$AWS_ACCESS_KEY_ID** and **$AWS_SECRET_ACCESS_KEY**
set in your environment, (as well as **$AWS_S3_BUCKET**), then run the
following command to deploy the app to S3:

```bash
$ npm run-script deploy
```

## Further Reading / Useful Links

* [Ember.js](http://emberjs.com/)
* [Ember CLI](http://www.ember-cli.com/)
* [Grunt](http://gruntjs.com)
* [Grunt S3](https://www.npmjs.com/package/grunt-s3)
* [Bower](http://bower.io)
* [Zurb Foundation](http://foundation.zurb.com)
* [Markdown](http://daringfireball.net/projects/markdown/syntax)
* [YAML Front Matter](http://jekyllrb.com/docs/frontmatter/)

[ember]: http://emberjs.com
[aws]: http://aws.amazon.com
