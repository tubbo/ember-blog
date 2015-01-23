---
title: simplifying my ruby life
date: 2012-11-23
category: code
tags: ruby, bundler, rvm
---

Ruby is all about simplicity. Make simple things simple, right? So how come we have to deal with all
this complexity when we run Ruby? This is how I made my life slightly easier and got some really
[sweet benefits][ctags] as a result.

## how i learned to stop worrying and uninstall rvm

I've been a loyal [RVM](http://rvm.io) user for years, practically ever since it came out. When it
first started, it was a simple way to manage the different versions of Ruby you had installed.
Simple, right? But then, as the project grew its scope became larger. RVM became more about managing
your Rubies, it now had integration with all kinds of software and "gemsets", a way to organize each
project's gems in their own separate, sandboxed environments that is still an unmatched, all-in-one
way to handle dependencies and Ruby version management.

But RVM has its problems. For starters, it can be very annoying to manage paths in the middle of
working on a project because either RVM or you fucked something up. Being made of shellscripts, RVM
is incredibly brittle and at one point was under such active development that it was easier to just
keep up with the Git repo than keep downloading new stable versions every day. RVM was constantly
being forked to keep up with its growing list of strange issues that came with the territory of its
quite revolutionary/obscure methods of solving the problems of multiple Ruby installs and projects
on the same machine.

Secondly, and this is most of the reason why I switched, as RVM increases in size the time my shells
take to open up increases dramatically. As they must load the entire RVM codebase each time, my
shells take an exorbitantly long time to open, even when my ZSH configs are optimized to an extreme.
The real bottleneck is, and always has been, RVM.

As [Ruby 1.8 began to sunset](https://www.engineyard.com/blog/2012/ruby-1-8-7-and-ree-end-of-life/),
 I felt as though my time with RVM was coming to an end. I hesitated for a moment, then typed
`rm -rf ~/.rvm` into iTerm and hit enter.

I didn't see the prompt again for another 20 minutes.

## entering the 21st century

With that said, it was time to actually install Ruby. Knowing that I no longer need 1.8, have no use
for 2.0, Rubinius or JRuby (right now), and don't want to lock my projects into older versions of Ruby, I installed
the language like I install anything else on my Mac, with Homebrew:

    brew install ruby

I use the Ruby in /usr/local/bin because I can test against the latest 1.9 for all my apps, and
because the Homebrew Ruby is typically quite up-to-date. Using this as your only Ruby does pose a
number of problems:

- Using 1 directory for all of your gems may prove a bit haphazard, since many of my projects are
  on older versions of Rails or other gems and require different versions to be installed in different
  places.
- Upgrading to a newer version of Ruby requires reinstalling your whole `gem list --local`.
- If you change your `$GEM_HOME`, you have to remember to clear it or change it back to access the
  gems you installed in this "global" path.

## bundler to the rescue...

Of all the great Ruby projects out there, Bundler's got my vote for the hands-down best maintained
Ruby project. Not only is it mostly error-free, it's fast, beautiful, has sensible defaults, and
generally just **makes fucking sense to me**. Bundler, the reason for Bundler's creation, and the
philosophies that went into its design, are what makes Ruby such an amazing language to work with.
In my mind, Bundler and [RubyGems](http://rubygems.org) serve as golden examples for how
dependencies and project-specific dependency management should be implemented in a language, and few
others even come close to replicating its symbiotic beauty.

While Bundler is somewhat tedious and confusing to use, I've found it perfect for managing my
projects gem dependencies on a conventional basis. It solves all of the problems posed from using a
single Ruby, since it installs gems locally to `./vendor/gems`. This is a sensible default location,
in with the rest of my vendored code, and easy to remember and type. I can write
`PATH=vendor/gems/bin:$PATH` in my ZSH config to always have binaries in vendor/gems available to
execute. However, this again poses a problem that Bundler cannot solve...

## with his trusty sidekick, autoenv!

RubyGems has a variable called `$GEM_HOME` that is blank by default. If this variable is not set,
RubyGems looks in the default location (`/usr/local/lib/ruby...`) for your installed gems.
Otherwise, it looks in the path provided by `$GEM_HOME`. In order to only use Bundler as a
dependency manager, you must manage this shell variable yourself. I use [Autoenv](http://github.com/kennethreitz/autoenv) to do
this for me. Autoenv is a simple shellscript that overrides `cd` (just like RVM) and runs a file
called `.env` local to the current directory. Right before `cd`ing into the dir, the `.env` file is
sourced and the code inside is executed. Typically, these files are used for configuring sensitive
data that you may not want in a repo anywhere, but you can also use them to build "pseudo-gemsets"
localized to your app's directory. A perk of Autoenv is you can also add other configuration to this
file and not worry about Autoenv clashing with RVM, since they both override the same program.

In order to make your bundle recognizable by RubyGems, you have to execute the following line upon
entering the directory:

    export GEM_HOME='vendor/gems'

Whether you do this with Autoenv or by other means is up to you, but it must be done. `$GEM_HOME` can not
take multiple values, it is used as a prefix and can only be one directory. I found Autoenv to be
the perfect companion, especially for Heroku applications. Autoenv has a special convention by which
adding a ~/.env file will be executed upon every `cd`, no matter where the destination. By
symlinking `~/vendor/gems` to my actual gems directory in `/usr/local`, I no longer need
project-specific files to tell where my gems are located.

## that's all folks

Well, that's how I set up my Ruby environment. All of this stuff is pre-configured for you (if you install
Bundler and Ruby 1.9, of course) in my ZSH framework called [DOTS](http://github.com/tubbo/dots). I'll do a whole
write-up in the future, but to install it all you have to do is run the following line in ZSH:

    gem install zsh_dots && dots install

This will create ~/.dots from the Gem dir, link all of the dotfiles in ~/.dots/config, and reload the shell.
When your prompt comes back, you should have a ~/.bundle/config and ~/.env all ready to go, along with Autoenv
and the rest of my ZSH goodies. Note: Any dotfiles that aren't already synced will NOT be touched,
but it will load configuration for any dotfiles you don't have. So keep that in mind.

[ctags]: /2013/02/05/who-needs-docs-when-you-have-ctags
