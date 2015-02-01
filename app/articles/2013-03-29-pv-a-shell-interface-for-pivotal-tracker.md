---
layout: post
title: "pv: a shell interface for pivotal tracker"
category: code
date: 2013-03-29
tags: pivotal tracker, bugs, ruby, work, elocal
---

At [eLocal][el], we use the lovely [Pivotal Tracker][pt] to track our
work progress. It has a really great interface for viewing stories, and
some additional features like tasks, rich text comments, and the ability
to "predict" future iterations by using the velocity and "points" system
(which is totally arbitrary). Another great feature is the story states,
which are also arbitrary, but we use them for very specific
purposes...for example, **Delivered** means the story has been placed on
the stage server and is ready for testing, while **Finished** just means
that I've pushed the code to master branch and it *can* be deployed at
any time.

But enough about our workflow, I want to talk about a tool I wrote that
makes it easier for you to see upcoming stories in a `git log`-style
format, totally within the shell...

## introducing [pv][pv]

[pv][pv] is a command-line tool that views and edits the Pivotal Tracker
stories that have been assigned to you in the **My Work** pane. It's
scoped to just your work, and `pv` was definitely designed from the
perspective of developers *working on* a project, not project managers
who are managing those developers. My opinion is that Pivotal Tracker's
UI was designed primarily for people like that, so this shell tool is
simply a different way of seeing that, geared more towards developers
who don't need to see the scope of the whole project every time they
want to check up on their stories.

The goal behind [pv][pv] is to mirror the functionality of
[pivotaltracker.com][pt] in a manner that is suitable for "worker bee"
developers who need only be concerned with their work. We are slowly
working towards that, with a roadmap that includes **commenting**,
viewing tasks in a nice bulleted list (in `pv show`), and more...

## viewing stories

The two most useful features are `pv log` (aliased to `pv` for
convenience), which shows your entire "My Work" pane:

![pv log][pvl]

...and `pv show $STORY_ID`, which shows more details about a single
Pivotal story:

![pv show][pvs]

From these two commands, as well as `pv open` (which just runs `open` on
the story ID you pass in, opening the URL for it in a browser), you can
see practically every aspect of the story from within the shell
environment.

## editing stories

You can also modify stories using `pv`. When I combine it with
[git-tracker][gt], I don't really have to ever visit
[pivotaltracker.com][pt] at any point during my work day, unless I just
*want* a better interface, or I need to click links (better to do that
in a web browser than in the shell, IMO). If you want to modify a
story's state outside of a commit message, pass the state and story ID
to `pv` like so:

    pv finish 123456

You can pass any state here, like `start`, `finish`, `deliver`, `accept`
and `reject`, as the first command to change the state of your story.
However, at this point it's best to just `pv open` the story to change
details like its title, tasks, description, or to leave comments.

## per-project configuration

[Check out pv's README][pvr] for more information on how to configure,
but basically you can opt to always use the same config in `~/.pv`, or
you can place a `.pv` file in each of your repos to change the account
or project ID that `pv` uses to make API calls.

### [install that shit][inst] if you want to know more

[el]: http://elocal.com
[pt]: http://pivotaltracker.com
[pvl]: /images/pv1.png
[pvs]: /images/pv2.png
[pvr]: https://github.com/tubbo/pv/blob/master/README.md
[inst]: https://github.com/tubbo/pv/blob/master/README.md#installation
[pv]: http://github.com/tubbo/pv
[gt]: http://github.com/stevenharman/git_tracker
