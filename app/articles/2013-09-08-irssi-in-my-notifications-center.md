---
layout: post
title: irssi? in MY notifications center?
category: gbs
date: 2013-09-08
tags: irc, irssi, osx, shell, work
---

As I've said before, I'm constantly working in [the shell][zsh] and have
found [many ways to improve my flow][dots] since I began working
this way. I also like to keep in contact on [IRC][freenode] to give out
help on Ruby, JS or Rails (and constantly learn in the process), chat
with friends, or discuss open-source projects. I use [irssi][irssi] to
connect to Freenode, a shell client, and I wondered if it would be
possible to get Notifications Center to listen in on my chats and let me
know when I get new messages. Thanks to alloy's powerful
[terminal-notifier][tn], I can!

* * *

Like I said, I run [irssi][irssi] through my own VPS which is running an
[irssi-proxy][proxy] to keep me connected all the time. This way,
connections to chat are speedy and efficient, and people can contact me
whenever they want...I'll see it when I get online. I've also begun to
wrestle with a project called [bitlbee][bitl] that connects to XMPP
chats, so I can talk with my co-workers with my IRC client...but I
haven't been able to get that up and running...maybe soon...

Anyway, this post is about getting Mac OS Notifications for your irssi
mentions and private messages.

## requirements

- [terminal-notifier][tn]
- [irssi][irssi]
- [trigger.pl][triggers], an irssi script
- Mac OS X 10.7 or greater
- The Homebrew package manager, or you can opt to compile irssi/TN from
  source.

## installation

First, install the necessary packages with Homebrew:

```bash
$ brew install irssi terminal-notifier
```

Make sure your scripts directory is in place:

```bash
$ mkdir -p ~/.irssi/scripts/autorun
```

Then, install the `trigger.pl` script to your irssi config directory.

```bash
$ curl 'http://scripts.irssi.org/scripts/trigger.pl' -o ~/.irssi/scripts/autorun/trigger.pl
```

Now you can open up irssi and type `/LOAD trigger` to enable triggers!

The triggers I used for building this feature are below. Just change the `-regexp` pattern
to your nick instead of 'tubbo' to get it working right:

```perl
-privmsgs -command 'exec /usr/local/bin/terminal-notifier -message "$\M" -title "$\N"'
-publics -regexp 'tubbo' -command 'exec /usr/local/bin/terminal-notifier -message "$\M" -title "$\N ($\C)"' 
```

You should be able to just paste those lines into `~/.irssi/triggers` (a
file you create), then run `/TRIGGER LOAD` from irssi to get the
triggers working.

And that should do it! Get one of your friends to `/msg` you or say your
name in a channel!

### one small caveat

Currently, all spaces are escaped in the notification. Makes it a bit
harder to read, but it still works. If anyone out there knows of a great
solution, hit me up on Twitter ([@tubbo][twitter]) and let me know about
it!

[tn]: http://github.com/alloy/terminal-notifier
[triggers]: http://scripts.irssi.org/html/trigger.pl.html
[zsh]: http://zsh.org
[dots]: http://github.com/tubbo/dots
[freenode]: http://freenode.org
[irssi]: http://irssi.org
[proxy]: http://irssi.org/documentation/proxy
[twitter]: http://twitter.com/tubbo
