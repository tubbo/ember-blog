---
title: "ember and electron: a winning combination"
category: code
date: 2015-08-04
tags: ember, electron, javascript, desktop
---

I've been playing around with the [Electron][electron] framework,
formerly known as **Atom Shell**. It's a tool based on
[Chromium][chromium] and [io.js][iojs] that allows you to build
cross-platform desktop applications in JavaScript, and is most famously
used as the framework for the [Atom][atom] text editor as well as the
[Slack][slack] team messaging application. While Apple, Google and
Microsoft all offer intriguing platforms and lots of cool features,
there was something I needed to build quickly and didn't have the time
or resources to find native OS X/Windows developers in which to help me complete it. So I turned to the tools I know best: JavaScript and, especially, [Ember.js][ember].

As I spoke about in my [last post][emberblog], I've also been playing
around with Ember.js a lot in recent months. It's a really cool
framework and I urge anyone, especially Rails developers, to check it
out. Although Ember was designed for writing web applications, I was
interested to see whether it was possible to write a desktop application
that communicated with both local and remote services using Ember.js.
Turns out, it sort-of is! I found
[an example electron app][ember-electron] that helped me get pretty far
in my endeavors, but it seemed to have some minor details missing,
especially when you attempt to build the app into a package that can be
distributed.

## what ember-electron gets right

The ember-electron example app brought me a *long* way from where I
originally was, having zero idea on where to begin. Since Electron can
load URLs as well as local files, the ember-electron repo was able to
have the local Electron development app connect to an instance of `ember
server` by waiting for Ember to start and then booting Electron. It did
this in a very interesting way...here's the shell command that was used
as the "electron" job in `node-foreman`:

```bash
$(while ! echo exit | nc localhost 5000; do sleep 1; done) &&
ELECTRON_ENV=development electron .
```

Unfortunately, this didn't quite work for me. I kept getting errors and
ending up in an infinite loop (on OSX Yosemite, running ZSH). However, by
breaking the command before `&&` out into a script and storing it in
**bin/wait-for-ember**, I was able to get rid of the problems that I
had. So if you're having issues getting your Procfile to play nice with
your shell, I suggest using that strategy and seeing if it works for
you.

I also had to set `locationType` in the config to "hash", as stated in
the notes for the ember-electron example app. This shouldn't really
mattter all that much as there's never going to be a situation (in my
app, anyway) that one will actually share a link with someone else in
this manner.

When you launch the Electron app for the first time, you'll get some
warnings in the dev tools console about **Content-Security-Policy**. To
mitigate these warnings, add the following to your
**config/enviroment.js** inside the `ENV` object:

```javascript
contentSecurityPolicy: {
  'default-src': "'none'",
  'script-src': "'self' 'unsafe-eval' 'unsafe-inline'",
  'font-src': "'self'",
  'connect-src': "'self'",
  'img-src': "'self'",
  'style-src': "'self' 'unsafe-inline'",
  'media-src': "'self'"
}
```

This will allow you to run scripts and styles from within the page, and
livereload won't trigger Content-Security-Policy warnings anymore.

All that aside, by following the steps laid out in ember-electron, you
can get an Ember.js app (created using Ember-CLI) booted into Electron
as a development server, to begin rapidly developing your app.
LiveReload works as well, so when you make a change to the **app/**
folder in your repo, the Electron app will refresh the page and you will
see your change live. Developing the UI for my desktop app has been
easy, quick and fun!

## the missing production-ready link

As stated previously, ember-electron is just an example and not really
designed for production use. While the **main.js** file will work in a
development server, attempting to run the app in a static HTML file will
not work correctly as the proper files (such as **main.js** and
**package.json**) are not in the **dist/** directory like Electron expects
them to be. You have to manually move those files over before compiling
the Electron app, otherwise you will get a very strange error stating
that your Electron app isn't valid, or you will just get a blank screen.

Thankfully, this kind of thing is easy to automate. I like to build my
JavaScript apps using a **Makefile** (I actually used one to
[build this blog][blogmake]!), because the `make` command is always
available, on pretty much any machine you want to be running this stuff
on. From that simple starter command, you can set off a chain of events
that eventually build and perhaps even launch your app. No need to write
any documentation on how to install, simply pull down the repo and run
`make` to get yourself up and running.

Here's an excerpt from the Makefile I used to build my Electron app. The
`make pkg` command will build the Electron app using an NPM script
called "package". But first, it will make sure the **main.js** and
**package.json** files are included into **dist/**, otherwise Electron
won't recognize the directory as a valid application when running in its
packaged form.

```make
dist/main.js: dist
	cp main.js dist/main.js

dist/package.json: dist
	cp package.json dist/package.json

pkg: node_modules dist/main.js dist/package.json
	@npm run-script package
```

The `npm run-script package` command that `make pkg` runs will run the
following shell command:

```bash
$ electron-packager . $APP_NAME --platform=win32,darwin --arch=x64
--version=0.30.1 --app-version=$APP_VERSION --app-bundle-id=$APP_BUNDLE_ID
--out=pkg
```

Note those "variables" in there aren't actually in the script, nor is
the "$" at the beginning of the code block. It's just to illustrate
where you'd interpolate your own values. You can also configure the
`--platform` and `--arch` switches to build for your own architectures,
but for what I'm working on it seems like just building for Windows and
OS X will suffice for now. That said, building for Linux is as simple as
appending its identifier to the `--platform` switch and recompiling the
application. No sweat!

## why ember?

In all my experience with JavaScript and especially its frameworks, I
haven't come across one nearly as complete as Ember.js. With its added
[Ember CLI][embercli] tool, it's relatively easy to do a lot of things
that most people developing purely client-side applications have
struggled with in the past. At this point in my life, I really don't
have the time to be hunting for the latest and greatest mini-libraries
for my build toolchain (I do that enough with Rails!)...instead, I'd
rather have something pre-made for me so that when I want to "get down
to business", I can do so with relatively little effort. Ember CLI,
along with its excellent testing/building infrastructure and built-in
development server, can also generate code and basically includes a
generator for anything you'd want in an Ember application. Building this
desktop app feels like building a Rails app, and that's something I've
wanted for quite some time.

## there's probably more to come

I'm just getting started with all of this...and will definitely post
more about pitfalls later. For now, [hit me back on Twitter][@tubbo] if
you have any advice or ideas on how to make this work better!

[electron]: http://electron.atom.io
[chromium]: http://www.chromium.org/
[iojs]: https://iojs.org/en/index.html
[ember]: http://emberjs.com
[emberblog]: http://psychedeli.ca/2015/07/11/a-new-year-a-new-blog
[embercli]: http://www.ember-cli.com/
[ember-electron]: https://github.com/usecanvas/ember-electron
[blogmake]: https://github.com/tubbo/blog/blob/master/Makefile
[@tubbo]: https://twitter.com/tubbo
