---
layout: post
title: don't make this simple mistake...
category: code
date: 2013-03-01
tags: ruby, bundler, rubygems
---

## install bundler-1.3 before installing Ruby 2.0!

So as the Ruby community has been unanimously updating to version 2.0
in the past few weeks, I decided to check out some of the newest goodies
available to us developers now that stable versions of Ruby, Rails,
RubyGems and Bundler are all available.

If you, like me, are installing this through `ruby-build`, be aware that
**ruby-build will not install or update Bundler for you!**

This is somewhat problematic because Bundler (if it's installed) *has* to
be version 1.3 or above for RubyGems to install. Otherwise, you'll get this
when you try to run any RubyGem (after installing through Bundler which actually
works fine)..

    There was an error in your Gemfile, and Bundler cannot continue.

Go try and install Bundler. Don't worry, I'll wait:

    ♬  gem install bundler --pre
    Fetching: bundler-1.3.0.gem (100%)
    ERROR:  While executing gem ... (Gem::Package::PathError)
        installing into parent path /Users/necromancer/Sites/api.elocal.com/vendor/gems/gems/bundler-1.3.0/.gitignore of vendor/gems/gems/bundler-1.3.0 is not allowed 

This will now happen for every RubyGem you try to install.

## the fix

What you need to do here is clear out the .ruby-version file so your app
isn't running off Ruby 2.0 anymore, then install Bundler 1.3 using
RubyGems 1.8. Or, you could just downgrade RubyGems to 1.8 by doing

    gem update --system=1.8.25

That should downgrade RubyGems to a point that you can just do a
`gem install bundler` to obtain 1.3. Once you begin installing gems
with 1.3, everything in Ruby 2.0 will work out again.
