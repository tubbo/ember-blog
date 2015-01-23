---
layout: post
title: who needs docs when you have ctags
category: code
date: 2013-02-05
tags: ctags, documentation, vim, lifesavers
---

Ever since I watched [Aaron Patterson's Peepcode Play-by-Play][pbp],
I've been absolutely fascinated with the use of CTags to jump around
the various codebases you have installed (if you use Ruby, you know
how much of a maze it can be to figure out exactly where an error
is coming from!). As the name would imply, CTags were created for
C programmers dealing with massive codebases that typically had
minimal to no documentation. Developed during the first boon
of open source distribution, and created by some of the people
on the BSD UNIX project (it was originally released with BSD UNIX),
it was championed as a quick, easy and light-weight way of moving
around a codebase.

## required equipment

I've [written about my setup in the past][env], and I created a [shell
framework for zsh users][dots] that implements all of the concepts I'm
talking about here. This technique requires that you're editing your
code with [Vim][vim] (and any derivatives thereof) and managing your
[RubyGems][gem] with [Bundler][bndl]

### vim for the win

CTags was designed for Vim, and since I'm a Vim user I'm going to mostly
talk about [Exuberant CTags][ctags]. If you're an Emacs user, you might
have to do some extra customization in your editor, but the concept of
CTags is still relevant and in my opinion, still useful for any modern
programmer.

### bundler-managed gemsets

If you're a Rubyist, this probably won't work as intended unless you
manage your application's gems with [Bundler][bndl] and don't use
[RVM][rvm] to manage gemsets/rubies. The reason for this is that
Bundler stores your gem's code inside your application's root
directory (I have it configured to use `vendor/gems`, but most people
use `vendor/bundle` or something...I think that's the default), and
when you generate your `tags` file, it will only look at code under
the given root directory, so if you're only using Bundler to manage
your gem dependencies, you'll be able to access not only your
application's code, but the code of the entire Rails framework as well
as every other gem you're using. From what [Michael Papis][mpapis] and
[Deryl][ddd] have been saying on [IRC][#rvm], RVM2 will have support
for custom gem directories, so you can use RVM and Bundler to manage
dependencies in subdirectories of your project, rather than `~/.rvm`,
which makes it a pain for CTags to function (though I have seen Rake
tasks where this becomes a possibility).

## let's get it started

To set up CTags, we first need to install [Exuberant CTags][ctags] and
get it working with Vim. Thankfully, Exuberant CTags used to be included
with Vim, so they compliment each other quite nicely. It's a separate
project, now,

### OS X USERS!!!

I'm on OS X, so I actually had to rename a built-in binary bundled along
with my OS to use Exuberant CTags. OS X comes bundled with [Emacs CTags][etags],
which are not compatible with Vim (or practically anything else that uses
CTags, for that matter). Not sure if people on Linux-based OSes or other
flavors of UNIX also have to do this, but before installing Exuberant
CTags, I had to do the following command:

    $ sudo mv /usr/bin/ctags /usr/bin/etags

This still kept the Emacs binary around, but renames it to something that
won't conflict with the `ctags` binary you're about to install.

On OS X, you can just do the following to install Exuberant CTags:

    $ brew install ctags

This will place the binary in `/usr/local/bin/ctags`. Regardless of your
shell setup, I think it's just easier if you rename the Emacs CTags binary
and install from Homebrew or some other package manager, if you have to.

I'm not going to tell you how to install [Homebrew][brew] because you
should already know how or have it on your system. What are you waiting
for???

## use the tags, luke

CTags is just as easy to use as it is to install. Go to the root directory
of your project and create the `tags` file:

    $ cd ~/Code/very_important_application
    $ ctags -R .

Now, open your application code back up. Browse to a method definition,
it would be best if this method was one you knew had only one place it
was defined. Highlight the `method_name` in visual mode and hit **Ctrl+]**
to jump to it's tag definition. Did you notice how your buffer snapped
to the file where that method was defined? You can also go back to
previous definitions of a method by doing **Ctrl-[**, if the method has
been overridden numerous times. This is especially useful in Rails,
where lots of abstraction and overriding is taking place, and in such
a big codebase it's terribly useful to be able to quickly move between
the different method definitions, showing the evolution of the code
that you will eventually run as you call that method from a higher level.

It's so much easier to get work done when leaving the editor is only done
when you're *really* done coding or you need to look up something that
maybe isn't explained quite well in the documentation, as is the case
with many of Rails' lesser-known methods (especially those nice little
helpers in the view layer).

## keep it ignant

Remember to keep your `tags` file in your [global gitignore][ign] file,
`~/.gitignore`, in order to keep it out of your repos. It's not terribly
useful to have in there and generally, each developer is going to have
to generate their own tags index every time they download your code
anyway, so it's kinda pointless to version control the index.

I hope that this was an informative crash course on installing, building
and using CTags in your daily life. It would be even better if CTags makes
at least your work life a bit easier to deal with every day.

[pbp]: https://peepcode.com/products/play-by-play-tenderlove-ruby-on-rails
[env]: http://www.psychedeli.ca/2012/03/18/weaning-off-oh-my-zsh
[dots]: https://github.com/tubbo/dots
[vim]: http://www.vim.org/
[gem]: http://www.rubygems.org/
[bndl]: http://gembundler.com/
[rvm]: http://rvm.io
[mpapis]: https://twitter.com/mpapis
[ddd]: https://plus.google.com/114407361520857511779/about
[#rvm]: irc://irc.freenode.net/rvm
[ctags]: http://freecode.com/projects/exuberantctags
[etags]: http://www.emacswiki.org/BuildTags
[ign]: http://robots.thoughtbot.com/post/18739402579/global-gitignore
