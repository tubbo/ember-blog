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

* `git clone https://github.com/tubbo/blog.git [OPTIONAL DIR]`
* cd to the directory you chose and..
* `ember install`

## Running in Development

After running the following command, visit your app at <http://localhost:4200>

```bash
$ ember server
```

**Note:** This is not required for use in production.

## Usage

Mostly, the app doesn't need to be touched unless it's being developed
upon. To write articles, you can use a handy-dandy generator that is
provided. You can also run tests and deploy to S3.

### Writing a Post

To generate a new article, run the handy-dandy generator:

```bash
$ ember generate article TITLE
```

Then, edit the file generated at **app/articles/YYYY-MM-DD-title.md**.
The generator will automatically insert today's date to prefix the
article and allow files to be naturally listed in order of publish date.

### Running Tests

Tests are written with QUnit and run with Testem. Phantom.JS is also
required to run tests within the console.

To run tests in the console:

```bash
$ ember test
```

To run tests in the browser:

```bash
$ ember test --server
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
