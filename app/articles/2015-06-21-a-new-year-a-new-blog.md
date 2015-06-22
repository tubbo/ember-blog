---
title: a new year, a new blog
category: code
date: 2015-06-22
tags: ember.js, javascript, s3, aws
published: false
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

I've been following [Ember.js][ember] since they started work on it, and
right after they had renamed it from "SproutCore 2.0". Since people like
[Yehuda Katz][wycats] and [Tom Dale][tomdale] were running the show, I
was confident Ember was going to at least be interesting. So far, I've
been blown away by its adoption of ever-changing and new standards while
simultaneously maintaining backwards compatibility with older versions,
giving long deprecation warnings and "feature flags" which allow you to
enable or disable new framework features as you incorporate them into
your app. Ember seems committed to making sense out of what sometimes
feels like chaos in web development, and [writing in Ember 2.0 style][trt20]
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
- **Articles must be easy to create:** Ember CLI has an amazing
  blueprints feature, one which I found powerful and expressive. You can
  generate blueprints, which power the generators in Ember CLI
  themselves. I generated an [article blueprint][bp] and formatted the
  file path so that it includes today's date automatically. This
  preserves the file name convention, file format, and basic contents of
  each article (and page).

[ember]: https://emberjs.com
[data]: https://github.com/emberjs/data
[rails_app]: https://github.com/tubbo/psychedeli.ca
