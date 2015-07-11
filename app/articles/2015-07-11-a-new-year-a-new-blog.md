---
title: a new year, a new blog
category: code
date: 2015-07-11
tags: ember.js, javascript, s3, aws
---

Well it's been a little over two years since I last completely
reconfigured this blog, and now that it actually (mostly) works I felt
like it would be fun to take a little tour of the more interesting
features of this blog. The current iteration of the blog is written in
[Ember.js][ember], and the entire blog application lives on your
browser, hosted via Amazon's CDN. This post explains how I
built a pseudo-static web site with Ember and [Ember Data][data].

## why rewrite your blog again?

I [had a perfectly good Rails app][rails_app] running what kinda felt
like Jekyll inside the auspices of ActionView. I was also able to use
the asset pipeline and other Rails utilities to make it a great
experience in writing code. So why should I change from that?

First of all, a Rails app requires a Ruby application server, which
needs Ruby and probably a bunch of other shit. So I'll need to set
up on something like [Heroku][heroku], purely because I didn't feel like
paying for an instance on [DigitalOcean][do] or [AWS][aws]. I gradually
got tired of waiting around for my app to respond, and sought out other
alternatives.

### ember saves the day

I've been following [Ember.js][ember] since they started work on it, and
right after they had renamed it from "SproutCore 2.0". Since people like
[Yehuda Katz][@wycats] and [Tom Dale][@tomdale] were running the show, I
was confident Ember was going to at least be interesting. So far, I've
been blown away by its adoption of ever-changing and new standards while
simultaneously maintaining backwards compatibility with older versions,
giving long deprecation warnings and "feature flags" which allow you to
enable or disable new framework features as you incorporate them into
your app. Ember seems committed to making sense out of what sometimes
feels like chaos in web development, and [writing in Ember 2.0 style][ember2]
doesn't feel much different than Ember 1.0 style. Even Ember Data has
matured over time with a solid API that's both consistent and easy to
reason about.

The only problem with Ember is that in my line of work, I don't get a
lot of chances to play with up-and-coming JavaScript frameworks. Most
Rails shops I've worked for are firmly implanted in the "we serve HTML
from the server" tradition and not interested in long-living apps that
are entirely served from the client side. So, realistically...the reason
I wanted to rebuild my blog was to learn more about how Ember.js works
and whether or not it's the framework of my dreams.

## what were the requirements?

I chose to lay out my hard requirements here in case anyone is reading
this thinking they can use Ember.js for anything. I'm sure you will find
use cases that Ember is not meant for, but for my use case, Ember was a
fine choice. Here's what I needed out of a rewrite of my blog:

- Since I already had some links to my articles floating around the
  interwebs, I needed to **preserve the URLs** to all of my posts. To do this,
  I needed to remain following the `/:yyyy/:mm/:dd/:title` format of my
  previous app.
- As mentioned before, **hosting must be cheap** and easy to deploy to
  using a [Travis CI][travis] continuous deployment lifecycle. If at all
  possible, avoid purchasing a server.
- **Articles must be easy to create**, so I don't have to copy files around.
  Typing a one-line command in the shell to generate the file structure
  for an article is preferable.

Ember fares pretty well against these requirements. Here's how I used
Ember, Ember CLI and Amazon S3/CloudFront to solve the above
requirements:

- **Preserve the URLs:** Ember.js has a [powerful routing system][router] that make practically
  any configuration of URLs possible. Given the framework's encouragement
  to make everything in your app routable, I felt like this wasn't going
  to be a problem.
- **Hosting must be cheap:** Since basically all of my code (minus the
  content compiler) lives on the client-side, I don't need to pay for a
  server or VM instance anywhere. Instead, I host the entire app from
  Amazon S3 and Amazon CloudFront. There's a script in the codebase to
  invalidate the CDN cache every time a deployment succeeds, so that the
  files on each browser are re-fetched as quickly as possible. I pay
  less than **$3/month** to host this entire blog that has hundreds of
  page views a day.
- **Articles must be easy to create:** [Ember CLI][cli] has an amazing
  blueprints feature, one which I found powerful and expressive. You can
  generate blueprints, which power the generators in Ember CLI
  themselves. I generated an [article blueprint][bp] and formatted the
  file path so that it includes today's date automatically. This
  preserves the file name convention, file format, and basic contents of
  each article (and page).

## the meat and potatoes

The first thing I had to do in order to get this blog up and running was
figure out a way to replicate the "YAML Front Matter" and Markdown
processing that I was used to in my last blog. All of the articles
follow this format, and as long as I can compile them down to HTML I can
probably render them to a web page.

In the current incarnation, all of the Markdown processing is done on
the client-side, with the "server" (actually just static JSON files)
rendering out the raw data as it came down from the YAML Front Matter
compiler. I used [front-matter][fm], a great little npm package that was
simple and gave me exactly what I wanted.

### organizing my javascript

With the new ECMAScript 2015 features, JavaScript has become much easier
to use and organize. To maintain a simple "shell" interface to the whole
thing, I used a function that takes a directory argument and
instantiates the objects that are required to compile the files in that
directory:

```javascript
import path from 'path';
import fs from 'fs';
import Template from './template';
import Index from './index';

export default function compile(directory) {
  let root = process.cwd(),
      source = path.join(root, 'app', directory),
      destination = path.join(root, 'public', directory),
      index = new Index(destination, directory);

  fs.mkdir(destination, function(error) {
    // swallow errors
  });

  fs.readdir(source, function(dirReadError, files) {
    if (dirReadError) { throw dirReadError; }

    files.forEach(function(filename) {
      fs.readFile(path.join(source, filename), { encoding: 'utf-8' }, function(fileReadError, contents) {
        if (fileReadError) { throw fileReadError; }

        let template = new Template(filename, contents, destination, directory);

        if (template.publishable) {
          template.compile();
          index.push(template);
        } else {
          console.warn("Template", template.id, "will not be published.");
        }
      });
    });
  });
};
```

This is a lot of code, but trust that it all makes sense to live inside
this function. Most of the code here deals with iterating over the
directory of files given, reading their contents, and instantiating
workers that compile them into JSON. The `Template` class here does
most of the work in that department, taking a filename, the entire
contents of the file, as well as its destination name and directory. It
will only compile a new article or page if the `publishable` key has not
been explicitly set to `true` (the key defaults to true, so if not set,
the article will be published). By running `compile()` on the newly
instantiated Template, we are writing a new JSON file to disk.

There is an additional object generated here, the `Index`. An Index is
basically a collection of `Template` objects that have been compiled and
should show up in the `/articles.json` or `/pages.json` file. By
default, Ember.js will look in this file for the article to display on a
category or index page. Index is pretty simple, acting like an `Array`
by implementing the `push()` method, we can add entire Template objects
to the Index and let the Index deal with what attributes it picks out of
there. By calling `push()`, we are also implicitly writing to the JSON
file on disk that the index represents, as described above.

## don't fight the framework

While writing this code, I made sure I was doing things "The Ember
Way": using the same tools and components that Ember.js developers use.
The app was built using [Ember CLI][cli] and I used generators whenever
possible. I've also been keeping up to date on the latest news regarding
the changes in Ember.js and [the road to Ember 2.0][ember2] so that when
Ember 2.0 is finally released, it won't be too difficult to upgrade.
Ember.js is known for being easy to upgrade due to its support of
feature flags and reasonable deprecation policies.

That said, there were a few modifications I needed to make to Ember's
provided components, such as `DS.JSONAPIAdapter`, in order to get it to
read the flat JSON file. The only way I could get S3 (or my local
server) to serve the JSON file as the `application/json` Content-Type
was to actually give it a **.json** extension. So I needed to make the
following change to my `ApplicationAdapter` in order to get Ember-Data
to read its "API" properly:

```javascript
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  /**
   * Extend the JSON API adapter to use the +.json+ file extension so
   * that the static JSON files are found.
   *
   * @param string modelName
   * @param string id
   */
  _buildURL: function(modelName, id) {
    return this._super(modelName, id) + '.json';
  }
});
```

The models were made as conventionally as possible. For example, here is
the definition of `Page`:

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string')
});
```

Page is rather simple, only having static data and not needing to be
sorted in any special way. Compare that with the source for the
`Article` model:

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  category: DS.attr('string'),
  tags: DS.attr('string'),
  body: DS.attr('string'),

  year: function() {
    return this.get('_splitID')[0];
  }.property('_splitID'),

  month: function() {
    return this.get('_splitID')[1];
  }.property('_splitID'),

  day: function() {
    return this.get('_splitID')[2];
  }.property('_splitID'),

  href: function() {
    return this.get('id')
      .split(this.get('year')+'-').join('')
      .split(this.get('month')+'-').join('')
      .split(this.get('day')+'-').join('');
  }.property('id,year,month,day'),

  preview: function() {
    return this.get('body').split("\n\n")[0] + this.get('footnotes');
  }.property('body'),

  footnotes: function() {
    return "\n\n"+this.get('body').split("\n").map(function(line) {
      if (line.match(/\[(\w+)\]\:\shttp/)) {
        return line;
      }
    }).join("\n");
  }.property('body'),

  /**
   * @private
   */
  _splitID: function() {
    return this.get('id').split('-');
  }.property('id')
});
```

As you can see, Article is a bit more complicated. I needed to be able
to pick out the year, day, month and "id" (a parameterized version of
the title) from the filename of the article, as well as the preview and
"footnotes" for each article. This is so I could construct and
deconstruct articles like **/2000/01/01/happy-new-year** into a date and
ID for a specific Article record.

## the front-end

I'm still using [Zurb Foundation][foundation] as my main CSS framework.
It's easy to make apps that look nice and act responsively when browser
sizes change over time. My web applications have never looked better
than when I began using Foundation. It's quite configurable and great
for Rails apps, which is how I got started on it, but it's also quite
easy to add to an Ember.js app if you run the following command:

```bash
$ ember install ember-cli-foundation-sass
```

Ember CLI's [large collection of addons][addons] is another benefit to
the Ember.js ecosystem. You can find an addon for pretty much anything
you wish to incorporate into your app. For example, here are the
Ember CLI addon dependencies that are configured for **psychedeli.ca**:

```json
{
  "ember-cli": "0.2.7",
  "ember-cli-app-version": "0.3.3",
  "ember-cli-babel": "^5.0.0",
  "ember-cli-content-security-policy": "0.4.0",
  "ember-cli-dependency-checker": "^1.0.0",
  "ember-cli-foundation-sass": "1.1.1",
  "ember-cli-htmlbars": "0.7.6",
  "ember-cli-ic-ajax": "0.1.1",
  "ember-cli-inject-live-reload": "^1.3.0",
  "ember-cli-qunit": "0.3.13",
  "ember-cli-sass": "3.1.0",
  "ember-cli-uglify": "^1.0.1"
}
```

Granted, a lot of these addons came directly from the base installation
of Ember CLI, but I added **ember-cli-foundation-sass** and
**ember-cli-sass** to the mix in order to support our frontend.

## `make` haste

In my quest to further automate the deployment of my app, I turned to
one program that I knew would be available on any machine the app was
installed to: [Make][make]. The Makefile is a great addition to any
JavaScript developer's toolbelt. When you need to combine a bunch of
commands together, why use a crazy shellscript when you can take
advantage of an existing powerful build system?

Here's the **Makefile** I use to test and deploy the app:

```make
EMBER_ENV ?= development
SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: clean lib dist

.PHONY: clean all test deps

clean:
	@rm -rf $(LIB) tmp dist doc public/articles/*.json public/pages/*.json public/pages.json public/articles.json

node_modules:
	npm install

bower_components:
	bower install

bundle: node_modules bower_components

lib: bundle $(LIB)
lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< -o $@

dist: bundle lib
	ember build --environment=$(EMBER_ENV)

test: bundle lib
	ember test

watch: bundle clean lib
	ember server

doc:
	esdoc -c config/docs.json
```

Travis automatically runs `make test` as its "script" command and `make`
on "after_success". Due to the way we cache NPM packages and Bower
components on Travis, I still use the regular `npm install` command to
install JavaScript dependencies. The Makefile doesn't deploy the actual
code, I keep my AWS keys encrypted via Travis so that the only way it
can be deployed is through the CI system. Travis provides a means of
safely deploying to Amazon S3, as well as encryption of secure
variables, so it's a fine choice as a "client" for deployment to S3.

## a truly continuous workflow

After setting all this up, I can now freely write articles and not have
to worry about whether I can deploy the new changes at the time of
writing. Since everything is automated, the only work required to
publish an article to the web is a `git push` to GitHub. There are still
a few things I'd like to add on some kind of `after_deploy` callback on
Travis that would aid in CDN cache invalidation as well as promotion of
new article links to [news aggregators][hn] and [Twitter][@tubbo].

You can view the entire source code to this blog on [GitHub][source].

[ember]: http://emberjs.com
[data]: https://github.com/emberjs/data
[rails_app]: https://github.com/tubbo/psychedeli.ca
[cli]: https://ember-cli.com
[ember2]: https://github.com/emberjs/rfcs/pull/15
[foundation]: http://foundation.zurb.com
[addons]: http://www.emberaddons.com/
[make]: https://www.gnu.org/software/make
[hn]: https://news.ycombinator.com
[@tubbo]: https://twitter.com/tubbo
[source]: https://github.com/tubbo/blog
[fm]: https://www.npmjs.com/package/front-matter
[do]: https://digitalocean.com
[aws]: https://aws.amazon.com
[@wycats]: https://twitter.com/wycats
[@tomdale]: https://twitter.com/tomdale
[travis]: https://travis-ci.org
[heroku]: https://heroku.com
[bp]: http://www.ember-cli.com/extending/#generators-and-blueprints
[router]: http://guides.emberjs.com/v1.12.0/routing/
