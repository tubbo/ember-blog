---
layout: post
title: blogging from scratch
category: code
date: 2012-11-25
---

In case you haven't already figured this out, I am a Ruby programmer. It took me a while
before I was really comfortable with calling myself a "programmer" when dealing with Ruby,
because I did something most people advise against. I learned Ruby by learning Ruby on
Rails. So I learned the framework before I learned the language. Generally, this is
frowned upon and causes some very bad habits to develop eearly on. However, learning Ruby
this way turned out to not be so bad (even though it took me a bit longer to dive in to
Ruby itself), and I continue to make the argument that having quick, tangible results and
an emphasis on rapid prototyping allowed me to quickly and easily pick up some of the more
advanced concepts of not only Ruby, but HTTP and web development in general. As it is my
day job, I do enjoy working in Rails, but sometimes its paradigm just doesn't fit in
(well) with what I'm trying to do. So I wanted to use something different.

I tried a [number][sinatra] [of][camping] [alternatives][typo] to simplify the development
process, but I wasn't really feeling any of them. Early readers will remember [Typo][typo]
as one alternative I used for quite a while because it was the only one that had XML-RPC
connectivity. The main way I blogged back then was through [TextMate][mate], so I could
simply push the post to the server after I was finished with it, and keep the text copy on
my computer as a backup. I gave up attempting to construct an XML-RPC interface to any of
the existing blogging platforms, and basically settled on Typo because it already had that
in place. Everything else about it sucked though, it still used Rails 2.2 (Rails 3 was
out!), Prototype.JS for the JavaScript, and an antiquated themeing framework that just
made everything harder to comprehend.

Then, I came across this new thing that [Tom Preston-Werner][tpw] (one of the founders of
GitHub) built as the engine that runs GitHub Pages. It's called [Jekyll][jekyll] and it's
well, awesome. Jekyll merges HTML layouts with Liquid templates and Markdown text content
to build a site that's simple and fast. Since it's just static HTML, there's no waiting
around for the database to return with the proper data, nor is there any extra time while
the data is parsed to be human readable. Everything is "just there". But Jekyll isn't a
complete solution. Designed for GitHub pages, a huge userbase, it's of no surprise that
the program isn't all that configurable. For example, you can't change the directory where
posts and layouts and plugins are read from, nor can you change the location/filename of
the YAML config. Until now, that is.

## hacking jekyll

I wanted to design [my blog's folder structure][src] in a certain way. For starters, I'm
already using 3-character folder names for any custom directories that weren't being
preprocessed by Jekyll. I wanted the content rendering engine to be just one part of how
the entire app operates, as I have also added [Sprockets][ass] for asset preprocessing and
a Rack app or two for some realtime custom content. Using [TryStatic][static], the static
content on <http://psychedeli.ca> can be served on the Rack stack alongside
[StatusExchange][sx], my status update feed(s) parser. Rack middleware allows me to handle
each request that comes in with a set number of classes. So for example, StatusExchange is
only meant to respond on requests to **/status**, and any other requests just gets sent to
the next middleware, which in this case is TryStatic. TryStatic will simply read the
request and try to find a matching file in the **pub/** directory, which is where Jekyll
is storing the site.

## back to your roots

After attempting this setup, I was poised to find out that "fighting the framework" against
all of Jekyll's better judgment was a bad idea. As I continued to experiment more with my blog,
Jekyll became simply an obstacle rather than a solution in my quest to make my blog better and
more powerful. In addition, my folder structure a few years ago looked very similar to your
typical Rails application, with some minor renaming differences. So I decided to swallow my
pride and return to the Rails ecosystem.

Doing so provided a number of significant advantages:

- It comes with a test suite built-in, so I can not only test the custom Markdown processor
  I wrote, but also the other libraries that are used to build the content on this site.
- Deployment with Capistrano and on Heroku is easier than wrangling static sites to work
  inside a Rack environment. This was probably the **biggest** reason, as updating the
  blog frequently became somewhat of an issue using my cobbled-together Jekyll site on Rack.
- Rails has the ability to cache entire pages to HTML, just like how Jekyll compiled my Markdown
  to static HTML. Using a custom library for parsing out YAML front matter and Markdown
  content with ActionView, we can implement pretty much the same thing that Jekyll was doing,
  with the obvious advantage of being inside the Rails stack and having access to the
  entire ecosystem of tools built for use with this framework.

As I've become more and more comfortable with Rails 3, I've also noticed a huge push
towards modularity in the Rails framework. Now that I don't have to include ActiveRecord
and other gems I'm not using, Rails becomes a much lighter framework, and still retains
its ease of use. And with the new fragment caching and page caching features coming in the
new Rails 4 release, I'm confident that my choice will not only replicate any benefits I
would've had from Jekyll, it will mitigate future development headaches when creating
simple features and experiments for the blog.

## getting it done

Using the `ActionView` template handling system, I simply passed in Markdown as if it was
a Rails view at first. However, Jekyll source files are not merely Markdown. They are a
combination of YAML front matter and Github-flavored Markdown, which means not only am I
going to have to parse the YAML configuration out of this Markdown source, I'm also going
to have to implement some sort of syntax highlighting with Pygments in order to replicate
the beauty and simplicity of Jekyll.

For starters, I used [Redcarpet][rc] to parse Markdown. I like Redcarpet the best out of all
the Markdown gems for Ruby, particularly because of its extensible rendering
architecture, allowing me to (like I just did) override the directive for parsing a block
of code and running a syntax highlighter through it. This one is the easy step: tons of
guides exist online to use `Pygments.rb` and a Redcarpet renderer to highlight your code
blocks in Markdown.

Next came the problem of the YAML front matter. Rails' templating system is not advanced
enough to parse *two* templating languages in the same file, sending data from one to the
model and data from the other as the actual view. Jekyll source files are in fact used
for two separate things, and since my blog articles are all written with Jekyll's YAML
front matter at the top, I needed a way to parse out that metadata and display it on the
page.

So I created a library called [ActiveCopy][ac] that allowed me to define a subfolder of my
view directories called `content/`. Here, I can place Markdown files with YAML front
matter instructions, and expect them to be compiled into metadata-rich articles that
looked exactly like (or better than) my Jekyll transformations.

## give it to me

ActiveCopy has not yet been extracted from my blog, but it was designed from the ground up
with the intention of becoming its own gem someday, since I'd like to use the concepts I
built on my own blogging app with future clients and ideas that I may encounter.

[mate]: http://macromates.com
[jekyll]: http://jekyllrb.com
[tubbo/jekyll]: http://github.com/tubbo/jekyll
[custom-dirs]: https://github.com/tubbo/jekyll/tree/feature/custom-dirs
[src]: http://github.com/tubbo/psychedeli.ca
[ass]: https://github.com/sstephenson/sprockets
[static]: https://github.com/gmarik/rack-try_static
[synth]: https://github.com/tubbo/psychedeli.ca/blob/master/bin/synth
[sx]: https://github.com/tubbo/psychedeli.ca/blob/master/lib/status_exchange.rb
[tpw]: http://tom.preston-werner.com/
[contrib]: https://github.com/mojombo/jekyll/wiki/contribute
[sinatra]: http://sinatrarb.com
[camping]: http://camping.rubyforge.org/
[typo]: http://typosphere.org
[rc]: https://github.com/vmg/redcarpet
[ac]: https://github.com/tubbo/psychedeli.ca/tree/master/lib/active_copy
