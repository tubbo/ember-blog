---
layout: post
title: introducing active copy
category: code
date: 2014-01-26
tags: rails, ruby, blogging
---

If you've ever browsed [the source code][repo] of this blog, you might
have noticed a directory called **lib/active_copy**. Opening up that
directory is somewhat interesting, as you'll be able to see exactly how
I take Markdown files with YAML front matter and render them through
ActionView. But unfortunately, unless you fork this repo and hack it to
bits, you were unable to use ActiveCopy in your own Rails projects.

Until today.

I've released [ActiveCopy][gem] to the world as a RubyGem and Rails
plugin. While not mountable, ActiveCopy requires Rails, and especially
ActionView, for all functionality to work properly.

## so...what is it?

ActiveCopy is a replacement for ActiveRecord, but instead of being
backed by a SQL database, it is backed by files which use a specific
kind of markup format. ActiveCopy was born out of the necessity (or
rather, desire) to "wrap [Jekyll][jek] in a [Rails][rails] app", giving
one the benefits of Jekyll's static file template compilation and simple
formatting, as well as Rails' deployment and testing toolchain.
Additionally, the use of Rails allows me to experiment a bit with the
features of this site, a prospect that would not be possible (in Ruby,
anyway) with Jekyll.

## get it working

First, add this to Gemfile:

```ruby
gem 'active_copy'
```

Install the bundle:

```bash
$ bundle install
```

Now you can generate an ActiveCopy model:

```bash
$ rails generate copy article name title
```

You'll get a free generator that will generate files for you:

```bash
$ rails generate article the-id-of-my-article
```

ActiveCopy supports date prefixing, to do so, run:

```bash
$ rails generate copy article name title --datestamp
```

when you declare the generator for your model.

## more information

You can view [the complete documentation][rdoc] if you wish to get more
involved with how the code works. But the [README][proj] on GitHub is
probably what you want to look at, as it contains a complete setup guide
and usage information for the gem.

[repo]: https://github.com/tubbo/psychedeli.ca
[gem]: http://rubygems.org/gems/active_copy
[jek]: http://jekyllrb.com
[rails]: http://rubyonrails.org
[rdoc]: http://rdoc.info/tubbo/active_copy
[proj]: http://github.com/tubbo/active_copy
