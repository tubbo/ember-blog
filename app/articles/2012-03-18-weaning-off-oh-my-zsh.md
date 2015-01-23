---
layout: post
title: "weaning off oh my zsh"
category: code
date: 2012-03-18
tags: shell, zsh, git, gitflow, productivity
---

Since December 2011, I've been working with [ZSH][zsh], an alternate shell for *nix-based operating systems which has conventions similar to [BASH][bash], ZSH adds a number of more modern features to the standard shell fare, such as more customization options for your prompt and extendable autocompletion. To get started on it, I've employed the lovely [Oh My ZSH][omz] framework which helps to organize your ZSH settings (`.zshrc`) and use functionality developed by others so you can explore the wonderful possibilities of this awesome shell.

Oh My ZSH was designed for new users, and is meant to be replaced at some point in the future by a `.zshrc` that handles everything. This was also my eventual goal, but after getting more comfortable with Oh My ZSH, I began realizing that I would be missing out on a number of enhancements it gives my shell experience:

- **Plugins:** A big part of my love for Oh My ZSH is its plugin architecture. With a shitload of premade plugins and the ability to easily add your own, incorporating new programs/functionality into my current shell workflow is trivial. For example, I began using [git flow][flow] yesterday, a plugin based on [Nvie's "A successful git branching model" blog post][nvie] and after enabling the plugin found that it was incredibly easy to work with. Through subsequent trial and error, this same functionality would have taken days to implement (making small changes/additions here and there), but with the plugin I was able to just start using git-flow using conventional 3-character aliases, just like my interface to git, with the same level of autocompletion I've come to expect from ZSH's powerful engine.

- **Concurrency:** Oh My ZSH has an update function that it fires each week to keep the plugins directory up to date. When new technologies are made available, it doesn't take very long before a plugin for that software is added to the Oh My ZSH repo.

- **Built-in functionality:** In addition to its massive plugin library, Oh My ZSH also comes with a collection of aliases, functions and variables for use in your scripts and everyday use. This useful built-in functionality is stuff I use on an everyday basis for prompt display, general hackery, and other fun shell tasks.

I need a framework for ZSH that can accomplish these goals, but doesn't bother with the theming or tricks designed to enable newbies to use ZSH. As someone mildly comfortable with this shell already, I want something a little more powerful but maybe not so easy to use.

## Introducing DOTS

The features of Oh My ZSH I highlighted above make it a possibility to use as a power user of ZSH. But as the aim of the Oh My ZSH project is to help newer users get acquainted with the shell, I've decided to start my own project, forked from Oh My ZSH but without the newbie sugar like themes and installation management tasks. I figure everyone can figure that out on their own. The idea behind this framework is for you to fork it, and maintain that fork with your own "dot files", scripts and other home-dir tools you need for general hackery. Once again, it's meant as a starting point but it strips away unnecessary shit that you're never, ever going to use.

### Git it!

So you wanna try it out? First, uninstall Oh My ZSH! (`rm -rf ~/.oh-my-zsh`) and run this little diddy:

    curl -L https://github.com/tubbo/dots/raw/master/tools/install.sh | sh

### Persisting your dot files

Not only is DOTS designed to take care of your basic ZSH tasks, it also persists your home directory configuration files ("dot files") across your machines. To invoke this feature, simply type the following in your home directory:

    persist .gemrc

(or whatever file you want persisted)

This will move the file to `~/.dots/config/gemrc`, add it to the git repository, and symlink `~/.gemrc` to `~/.dots/config/gemrc`. You can now commit this file into Git and synchronize it across machines when you update dots!

To stop persisting a file, type:

    forget .gemrc

This will replace the symlink with the file it's linked to and remove it from the Git repository. You will have to make a commit to confirm this change.

[zsh]: http://www.zsh.org/
[bash]: http://www.gnu.org/software/bash/
[omz]: https://github.com/robbyrussell/oh-my-zsh
[flow]: https://github.com/nvie/gitflow
[nvie]: http://nvie.com/posts/a-successful-git-branching-model/
[fork]: http://github.com/tubbo/oh-my-zsh
[DOTS]: http://github.com/tubbo/dots
