---
layout: post
title: the shape of web uis to come
category: code
date: 2013-08-30
tags: javascript, emberjs, emberscript, emblem, waxpoetic
---

Recently, I've been very interested in the development of the
[Ember.js][ember] framework, which has grown rapidly in the 3 years or
so that I've known it. We've seen [great apps][discourse] being made
with ([most of][eviltrout]) it, and it's gone from something that left
me truly puzzled into an understandable and almost indispensable
tool in my web development arsenal. While developing a Backbone app,
I took a second look at Ember after they released their new
[routing API][ember-routing], and fell in love with how *little* code I
wrote while [developing a simple application][forthcoming]. But the way
that Ember worked flies in the face with one of my other favorite
tools...

* * *

**NOTE:** This post is written from the perspective of a
[Ruby on Rails][rails] developer, using [ember-rails][ember-rails] to
generate my content and [ActiveModel::Serializers][ams] for constructing
my HTTP API.


## ember and coffeescript

While I have been writing JavaScript for about 14
years as of the date this article was written, I still prefer
CoffeeScript as a DSL for defining my objects. It's cleaner, easier to
read, and generates compliant JavaScript that (without too many
hang-ups) is very close to or exactly what I would have written by hand
anyway. Unfortunately, some of the unusual conventions in Ember,
especially related to adding computed properties and observers to
methods, make working with CoffeeScript quite difficult. Not to mention
that the `class`/`extends` keywords do not work reliably in conjunction
with `Ember.Object.extend()`.

## emberscript to the rescue

Thankfully, [Gordon Hempton][ghempton] has created [EmberScript][emberscript],
a CoffeeScript-style languaage that compiles to JavaScript. It is a
subset of CoffeeScript (you can avoid the special syntax altogether and
it compiles to the exact same code as CoffeeScript), but it compiles
directly to JavaScript so you're not dealing with trans-compiling
issues.

EmberScript adds a number of syntactical features to CoffeeScript that
make it well-suited for writing Ember apps. For example, in Ember.js
you must retrieve data using `Ember.Object.get()` (all Ember objects
are derived from `Ember.Object`, by the way):

```javascript
var App.Person = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
});

$(function() { // wouldn't really do this, just pseudocode for "runtime"
  var person = App.Person.find(1);
  alert(person.get('firstName')+ ' ' + person.get('lastName'));
});
```

But in EmberScript, you can write that code like this:

```coffeescript
class App.Person extends DS.Model
  firstName: DS.attr 'string'
  lastName: DS.attr 'string'

$ -> # wouldn't really do this, just pseudocode for "runtime"
  person = App.Person.find(1)
  alert "#{person.firstName} #{person.lastName}"
```

Notice how I used class/extends to describe the model. This is a visible
effect of the fact that EmberScript does not compile to CoffeeScript,
because it defines class/extends in a different way.

You can do even more with EmberScript. Let's say I wanted to make the
text in the alert dialog a method on Person, because I wanted to use it
elsewhere. In JavaScript, I'd have to define it this way:

```javascript
var App.Person = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  name: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});

$(function() { // alright i guess i don't have to tell you again..
  var person = App.Person.find(1);
  alert(person.get('name'));
});
```

That's a *little* better, but I feel like we can do a lot more with
less code. It's a pretty verbose way to say "combine firstName and
lastName in the return value of this method", we have to specify all of
the "dependencies" of the method at the bottom and then we still have to
use `this.get` in order to retrieve the attributes. Once again,
EmberScript comes to the rescue:

```coffeescript
class App.Person extends DS.Model
  firstName: DS.attr 'string'
  lastName: DS.attr 'string'
  name: ~> "#{@firstName} #{@lastName}"

$ -> # blah blah apologizing comment
  person = App.Person.find(1)
  alert person.name
```

Wow, that's more like it! We define the method just like CoffeeScript,
except with a special `~>` operator that defines functions wrapped in
the `.property()` method. Also something that's missing is the
dependencies declared in the arguments to `property()`. That's because
EmberScript automatically defers dependencies for computed properties.
Now that's what I call progress.

There's a lot more you can do. Check out the site for everything. Some
other highlights:

* Directives for observers (`+observer`)
* The `mixin` keyword for defining mixins
* The `with` suffix of `extends` that allow you to compose your Ember
  objects using mixins

In my opinion, the combination of Ember.js and EmberScript is already a
major productivity boost. But we can go even further.

## moving past handlebars

Ember uses [Handlebars.js][handlebars] as a templating language for
"sprucing up" your markup. They're mostly static templates, but they do
have some dynamic qualities like basic conditionals and loops for
visualizing collections of data. Handlebars is great, but much like
[Ruby][ruby] has [Haml][haml], someone's gone along and coded a
replacement for Ember called [Emblem.js][emblem].

Emblem is unlike a lot of other templating languages, because it
actually compiles down to Handlebars, which is used as the static
templating language on the client side. Like EmberScript, Emblem is
somewhat of a DSL for writing Ember apps, except Emblem takes care of
the templating layer. Since it compiles to Handlebars, it's possible to
use both custom Handlebars helpers and the ones you use from a 3rd-party
(or Ember itself).

## in the wild

The best example I can give is the one I'm currently working on, the
official site of [wax poetic records][waxpoetic]. It's built entirely
with Ember/EmberScript/Emblem.js, with a light backend written in Ruby
on Rails. It also uses the excellent [Zurb Foundation][foundation] CSS
framework, also in use on this blog. Check it out, and if you see
anything wrong, [file an issue][waxpoetic-issues]. I've made the
[source code][waxpoetic-source] available on GitHub if you're interested
in seeing how an app like this can be written.

## one more thing..

I haven't been able to get EmberScript working with Rails 4, but that's
a project I'm going to tackle this weekend. Also, it doesn't seem as
though `therubyracer` is supported, so uhh...install Node.js. :)

[ams]: http://github.com/rails-api/active_model_serializers
[ember]: http://emberjs.com/
[discourse]: http://discourse.com/
[eviltrout]: http://eviltrout.com/2013/03/23/ember-without-data.html
[ember-routing]: http://emberjs.com/guides/routing/
[forthcoming]: http://github.com/tubbo/forthcoming
[ghempton]: https://github.com/ghempton
[handlebars]: http://handlebarsjs.com/
[ruby]: http://ruby-lang.org/
[haml]: http://haml-lang.org/
[emblem]: http://emblemjs.com/
[rails]: http://rubyonrails.org/
[ember-rails]: http://github.com/emberjs/ember-rails
[emberscript]: http://emberscript.com
