---
layout: post
title: writing jquery plugins with coffeescript
category: code
date: 2013-03-25
tags: coffeescript, javascript, jquery, sumatra, rails
---

At [the job][el], we're constantly trying to improve the UX of
**eLocal.com** by making the site behave [harder, better, faster,
stronger][dp]. For some reason, recently we've had a surge in these kind
of feature requests from the "peanut gallery" of sales and operations
staff who are the primary source of feedback for the application. Most
of what I do every day is solving bugs or adding new features to this
big monolithic app, which powers the vast majority of our business. It
is used by the staff on a daily basis to accomplish all sorts of tasks,
from an in-house CRM to an advanced billing system (complete with
recurring charges and invoicing), as well as basic control of our paying
customers' ZIP code ads and lead dissemination.

Recently, I've been trying to codify and refactor the way I write
JavaScript code. Using CoffeeScript has been a major advantage, as it
makes the code much more readable for the way I develop my jQuery
plugins. As a proponent of the [object-oriented plugin design
pattern][jqd], CoffeeScript has always been in my radar for doing this
kind of thing, and now that I've learned enough about the language I
think it's now possible to codify how I've been writing my JavaScript
code, so the next guy doesn't have to write as much.

## how we write our javascript components

All of our components are instantiated with the [jQuery][jq] framework.
If you're dealing with the DOM, there's just no substitute. jQuery
handles a lot of boilerplate we'd have to build ourselves, and is
cross-browser to boot! The major reason we're talking about jQuery here,
however, is its minimal plugin architecture.

A simple jQuery plugin written in CoffeeScript might look like:

```coffeescript
jQuery.fn.viewAllButton = ->
  @each (i, element) ->
    $(element).on 'click', (event) ->
      container = $(this)
      button = container.find('button')
      form = container.closest('form')
      per_page = button.attr('data-per-page')

      form.find('input[name="per_page"]').val per_page
      form.find('input[type="submit"]').click()
```

Pretty easy to understand. For every element selected by this plugin,
bind a click action that submits the form without its `per_page` param
sent over, effectively returning all pages of all content. Most of the
details are just for the specific implementation on eLocal's admin
system.

But once plugins become complected to a further degree than this, the
functional model employed by the previous example begins to break down.
Having a lot of functions in your scope (that's *any* scope, not just
the global one) in JavaScript makes your code harder to read, and
eventually harder to debug. It is at this point when jQuery is no longer
enough to write effective, efficient and most of all easy to debug
JavaScript components. You need some bigger guns.

Thankfully, [CoffeeScript][cs] is here to save the day. CoffeeScript
"fixes" the absolutely disgusting syntax that JavaScript provides to
build objects. If you can imagine trying to stuff OOP into the concept
of a function, you basically got what JavaScript is doing. Using a
relatively common keyword, `class`, CoffeeScript gets the job done by
sticking to JavaScript best practices and, at the most simple level,
builds JavaScript object definitions in much the same way that I used to
by hand.

Here's an example of a CoffeeScript plugin that was built to solve a
simple UX problem when dealing with Rails `fields_for` associated forms:

```coffeescript
jQuery.fn.undoFieldsFor = (pluginOptions) ->
  @each (i, element) -> new UndoFieldsFor($(element), pluginOptions)

class UndoFieldsFor
  defaults:
    form: 'form'
    item: '.line-item'

  # Assign the `<form>` and `<input>` buttons that we're working with
  # to properly "undo" changes made to the line items in a form.
  constructor: (@element, options) ->
    @options = _.extend @defaults, options
    @form = $(@options.form)
    @item = @element.closest(@options.item)
    @initialize()

  # Bind a removal event onClick 
  initialize: ->
    @item.find('input[type=checkbox]').hide()
    @element.on 'click', @removeItem

  removeItem: (event) =>
    event.stopPropagation() and event.preventDefault()
    @item.remove()
    @_disableSubmission() if @form.find(@options.item).length == 0

  _disableSubmission: ->
    submit = @form.find 'input[type="submit"]'

    submit.removeAttr "value"
    submit.val "Disabled"
    submit.addClass "inactive"
    submit.attr "disabled", true
```

Basically, it replaces the `_destroy` checkbox on every additional item
with an "UNDO" button. When this button is clicked, the surrounding
line item element is destroyed and Rails will not submit that data as
part of the form, because it's no longer on the page. The plugin takes
advantage of the way Rails associations work, as long as you have an
index number higher than that of its previous index, you're good to go.
So that `_destroy` checkbox is really just there for compatibility, as
clients without JavaScript will not be able to take advantage of this
nice feature.

You can see just in this short example how easy it is to understand a
slightly more complex plugin like `undoFieldsFor`. For each selected
item that `jQuery.undoFieldsFor()` is applied to, the `_destroy`
checkbox is hidden and replaced with an "Undo" button. The click event
on this button (actually an `<a>` link) is bound to a JS action that
destroys the current `.line-item` but also disables form submission in
the event that no line items are in the DOM at the time the event is
fired.

## sumatra tastes exactly how it smells...delicious

You can already see a *lot* of boilerplate going on in the above
CoffeeScript plugin example. For starters, I always have to do that
little code on line 1 which sets up the jQuery plugin and tells it to
instantiate a helper class every time. Also, because `UndoFieldsFor` is
an object, I need to construct it with an `$(element)` jQuery object and
the `options` hash passed into the plugin at time of instantiation.
Wouldn't it be sweet if I didn't have to do this every time? Wouldn't it
be nice if I could use an interface that allowed practically every part
of the object building process to be customized, but in most
conventional setups, would default to some sane settings that could be
used for quickly writing jQuery plugins in a beautiful way.

Here's the same plugin implemented using the JavaScript
framework/library I made to codify this technique, [sumatra][sum]:

```coffeescript
sumatra 'undoFieldsFor', ->
  class UndoFieldsFor extends SumatraPlugin
    action: 'click'
    defaults:
      form: 'form'
      item: '.line-item'

    # Set up the <form>, .line-item and submit button we'll
    # be working with, and hide the checkbox from view.
    initialize: ->
      @form = $(@options.form)
      @submit = @form.find 'input[type="submit"]'
      @item = @element.closest(@options.item)
      @item.find('input[type=checkbox]').hide()

    # Remove the surrounding .line-item
    perform: (event) =>
      event.stopPropagation() and event.preventDefault()
      @item.remove()
      @_disableSubmission() unless @_lineItemsExist()

    # If no more items are left, disable the submit button on this form.
    _disableSubmission: ->
      @submit.removeAttr "value"
      @submit.val "Disabled"
      @submit.addClass "inactive"
      @submit.attr "disabled", true

    # Check if any line items still exist in the form.
    _lineItemsExist: ->
      @form.find(@options.item).length
```

By comparing these two bits of code, you can clearly see how we've
abstracted some common functionality and increased the readability of
our code. I have yet to find a JavaScript problem that I can't apply
this solution to. As long as I have to create a new plugin, this always
seems like the best way to do it. Let's break down what I'm doing here..

**sumatra()** is a globally-available function that performs that
first line of jQuery from the control example. Since it's written in
CoffeeScript, this function also returns the object defined on its
last line, which is typically the implementation of the plugin itself.
You can name the plugin here, defining how you will call it via
jQuery, and that code you pass in as a function is called as the body
of the jQuery plugin.

```coffeescript
sumatra 'undoFieldsFor', ->
```

Now we're defining a new class which extends from **SumatraPlugin**.
The object it extends from has some [really awesome time-saving
features][sp], but it is purely optional and has no bearing on the
plugin you actually make.

```coffeescript
  class UndoFieldsFor extends SumatraPlugin
    action: 'click'
    defaults:
      form: 'form'
      item: '.line-item'
```

In the class itself, we define an **action** which is the event that
we're listening for, and when fired will cause `perform()` to execute.
This `perform()` method is another thing we have to define in the
class itself, as it is the hard-set event handler for the plugin.

Additionally, Sumatra gives us a place to define default option values
for the `options` hash that can be passed into any Sumatra plugin. You
can set up this hash in `defaults`, which is merged with the passed in
options to build the public `@options` property.

```coffeescript
    initialize: ->
      @form = $(@options.form)
      @submit = @form.find 'input[type="submit"]'
      @item = @element.closest(@options.item)
      @item.find('input[type=checkbox]').hide()

```

While the constructor sets us up with some sane, minimal defaults, the
`initialize()` method is for code that would normally go in the
constructor. **It is bad practice to override SumatraPlugin's
constructor**, since `initialize()` provides everything you need to
get the class support up and running. Here, we're just caching some
"instance" variables to some other elements that UndoFieldsFor needs to
know about, like the `<form>` surrounding all of this, and the `<input
type="submit">` button that is used to submit the form. Additionally, we
have the ability to set the item class in case of a conflict, so we also
cache the item property here and delete its corresponding checkbox.

```coffeescript
    perform: (event) =>
      event.stopPropagation() and event.preventDefault()
      @item.remove()
      @_disableSubmission() unless @_lineItemsExist()
```

Now it comes time to actually define what this plugin is doing. Notice
that here, unlike the other plugin, it's much less "baroque", and
basically defines the control flow of th event handler, instead of its
logic. Using Sumatra directly influenced the design of this plugin,
because now that we have a trusted framework set up to handle all of the
boilerplate crap (that I make EVERY TIME), we can go ahead and abstract
more of, if not all of, the actual logic into methods.

Since we've already defined `this.item`, we can just `remove()` it as
it's just a jQuery DOM object. And the line above that, preventing the
event from bubbling up and firing the default browser action, is also
standard for plugin/event authoring. That leaves us with the two custom
private methods, `this._disableSubmission()` and
`this._lineItemsExist()`. As you can see, we denote private methods with
a preceding `_` in the method name. **There are no private methods in
JavaScript**, so this convention is how we solve for that. Note that the
distinction between public and private is purely semantic, and has no
bearing on the logic of the code. They're to show *you* that the
methods were not written to be called externally on this object.

Let's take a look at **_disableSubmission()**:

```coffeescript
    _disableSubmission: ->
      @submit.removeAttr "value"
      @submit.val "Disabled"
      @submit.addClass "inactive"
      @submit.attr "disabled", true
```

We already know about `this.submit` because it was saved up in the
initialize method. So basically, all this method does is disable
submission until a new line item is added. But this method is only
called when another method returns, true:

```coffeescript
    _lineItemsExist: ->
      @form.find(@options.item).length
```

Here's a method that offers no real code line reduction, but increases
readability and visibility in the `perform()` method. This is the kind
of thing that Sumatra makes it easy for you to do, add methods that
increase readability and should enable a higher understanding of the
code out of its readers.

## doing it yourself because you're hardcore

Sumatra is [121 lines of
CoffeeScript](https://github.com/tubbo/sumatra/blob/master/pkg/sumatra.coffee)
and its concepts aren't very hard to implement from scratch in the first
place. Realistically, the most complex part is the `sumatra()` function,
which uses a bit of meta-programming to get the job done and allow you
to choose any class name as your service object. Other than that, I'm
just giving you an "interface" prototype object to build your plugin off
of, with *very* limited resources. This keeps the codebase light and
easy to read, and lets you take care of the important things.

## when you SHOULDN'T use sumatra

Sumatra's great for small jQuery plugins, but doesn't offer much more
than traditional jQuery for building and organizing huge,
JavaScript-centric applications. For that, you should use a more
complete framework like [Ember][ejs], [Backbone][bjs], or
[Angular][ajs], which provide more support and an MVC style for
designing your code base for both efficiency and readability. Sumatra is
best used as an addendum to mostly-HTML apps which desire little
bits of Ajax functionality or fun animations.

## check it out!

I'm interested to hear what others think of this, and I always at least
read over any contribution made by pull request to
<http://github.com/tubbo/sumatra>. That's where the codebase for Sumatra
is stored. To install it, you can use [bower][bwr]:

    bower install sumatra

Or, you can use the handy-dandy [sumatra-rails][smr] gem that I made to
use Sumatra within Rails' "asset pipeline". For efficiency and
consistency, each Sumatra package pushed to Bower is correspondingly
pushed to **sumatra-rails**, so simply by updating your Gemfile you can
start using the latest edition of Sumatra:

```ruby
gem 'sumatra-rails'
```

The breakdown:

- <http://github.com/tubbo/sumatra> is where the basic JS/CS is located
- <http://github.com/tubbo/sumatra-rails> is where you can find the
  Rails helper engine.

I hope this was at the very least entertaining, and at best helped you
learn a little more about the way we do things here at **eLocal**. A
short disclaimer: we do not use `sumatra` in production (yet!), but I
thought it'd be a great way to show you guys our conventions as
`sumatra` is somewhat of a codification of those techniques.

[el]: http://elocal.com
[dp]: http://randomaccessmemories.com
[jqd]: http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
