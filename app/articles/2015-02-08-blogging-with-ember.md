---
title: blogging with ember
date: 2015-02-08
category: code
tags: ember.js, javascript, blogging
---

Recently, this blog has gone under a bit of a transformation. I've been
thinking of moving off [Heroku][heroku] hosting for a while for a
multitude of reasons: faster response times, cheaper infrastructure
costs (I need to run a www-redirector) and generally less overhead for
people browsing an essentially static site. Instead of hosting a
server-side [Rails app][app] on Heroku, I wanted the entire codebase to
live in the browser, so users can download the whole "blog application"
and render templates as needed. My thoughts immediately turned to [Ember.
js][ember]. With the recent developments of [Ember CLI][cli], it's easier
than ever to create "long-living" client-side applications. I began to
embark on a greenfield redesign of the blog application in Ember.js, but
once again using [Zurb Foundation][foundation] as a basic CSS framework,
and using SCSS to define my styles.

# the first step: compiling articles

Before I began writing the Ember app, however, I needed to make sure
that I could compile articles on my workstation and upload them along
with the rest of the `dist/` folder to Amazon S3 when I wanted to
deploy. So I wrote [a little compiler][static-age-compiler] that would
parse article source files and compile their contents to Markdown, while
preserving the YAML Front Matter and converting those contents to an
object. I used the [js-yaml][yaml] library for YAML parsing into JS
objects and the [marked][marked] library for compiling article contents
into Markdown. Originally, this compiler was a part of the main
application until I began refactoring parts out for use in other static
sites I wished to build.

Building this compiler, however, was not enough. In order to
automatically compile articles to `dist/`, I needed to leverage Ember
CLI's existing [Broccoli.js][broccoli] asset compilation infrastructure.
So I [wrote an imperative shell][static-age-shell] that you can call
within the Brocfile to compile articles right before the app is compiled
to `dist/`. This hack allows articles to be included in the dist without
having to go through Ember.

# building the ember app and the first pitfalls

Now that I can get articles compiled when I build the app, I needed to
actually have an app to render them in! To get started, I generated an
`Article` model and began looking for ways to use it with Ember Data. I
didn't really need to use Ember Data for this project, but doing so
allowed me to explore exactly how interesting and customizable the
framework actually is.

Because I don't actually have an API to talk to, I needed to generate
the YAML front matter as JSON along with my static HTML files. Just to
reduce my hackiness footprint, I generated a "main index" called
`/articles.json` and an "attribute file" for each article named for
their ID. So, if an article had a source file of
`app/articles/2000-01-01-happy-new-year.md`, the compiler would generate
two files: `public/articles/2000-01-01-happy-new-year.html` and
`public/articles/2000-01-01-happy-new-year.json`, which held the HTML
contents and JSON attributes (respectively) of the Article. As mentioned
before, the information in the JSON file is also added to the array of
objects in the `public/articles.json` main index. Thankfully, it's
trivial to turn a JavaScript object into a JSON string, the hardest part
was figuring out exactly where in the `---`-split array we needed to
look for YAML contents (as well as Markdown). This immediately caused
problems because Ember.js was looking for JSON routes without the
`.json` filename. A quick extension of the `ajax()` method on the
ApplicationAdapter solved that problem cleanly:

```javascript
export default DS.RESTAdapter.extend({
  ajax: function(url, type, options) {
    return this._super(url+'.json', type, options);
  }
});
```

Additionally, storing the IDs as "YYYY-MM-DD-title" was a bit
problematic, as I wanted to denormalize this information into various
properties of the Article object. So my Article's `model` method needed
to look something like this:

```javascript
  model: function(params) {
    return this.store.find('article', this._resolveArticleID(params));
  },

  _resolveArticleID: function(params) {
    return [
      params.year,
      params.month,
      params.day,
      params.title
    ].join('-');
  }
```

Now, Ember.js was finding the right routes and loading the correct JSON
for my Article model, but it still wasn't showing the HTML contents.
Originally, I had a bit of [jQuery.ajax][$.ajax] code in my article
route's `afterModel` hook that would fetch the HTML and insert it into
the model object right before the page was rendered:

```javascript
  setupController: function(controller, article) {
    Ember.$.get('/articles/'+article.get('id')+'.html', function(html) {
      article.set('body', new Ember.Handlebars.SafeString(html));
    });
    this._super(controller, article);
  },
```

While this did work, it had the downside of being very coupled to the
Article itself. When I wanted to use this with static pages and other
models, it began to break down. This was also the time that I was
extracting code out into an addon, which the psychedeli.ca project (as
well as others) depend on.

# the birth of static-age

Generating an [Ember CLI Addon][ember-addon] is very easy, and similarly
to Rails engines, Ember addons allow you to literally copy code from a
running application into the directory structure of an addon, and simply
run it as if the code still existed in your app. This is precisely what
I did, copying code out of this application into the
[static-age][static-age] repository, and using it in other applications
just like I would with a Rails engine. It's very powerful, and I urge
any Ember developers to take a look at what it can do. When I wanted to
use the concepts in the blog repo with other static sites I was
developing, I began extracting the application code out of the repo and
placing it within static-age. In essence, the static-age addon is a
"complete ember app" which lets you get started on 

# using static age in your own app

Using static-age with Ember CLI is very easy. Generate an Ember app:

```bash
$ ember new my-blog && cd my-blog
```

Install the addon:

```bash
$ ember install:addon static-age
```

Generate your first article:

```bash
$ ember generate article in-b4-first-post
```

And see it in action!

```bash
$ ember server
```

# deploying to amazon web services

I use the [ember-cli-deploy][deploy] addon to deploy my S3 assets.

[heroku]: http://heroku.com
[app]: http://github.com/tubbo/psychedeli.ca
[ember]: http://emberjs.com
[cli]: http://ember-cli.com
[foundation]: http://foundation.zurb.com
[static-age-compiler]: https://github.com/tubbo/static-age/tree/master/compiler
[yaml]: https://github.com/nodeca/js-yaml
[marked]: https://github.com/chjj/marked
[broccoli]: http://broccolijs.com/
[static-age-shell]: https://github.com/tubbo/static-age/blob/master/compiler.js
[$.ajax]: http://api.jquery.com/jquery.ajax/
[static-age]: https://github.com/tubbo/static-age
[deploy]: https://www.npmjs.com/package/ember-cli-deploy
