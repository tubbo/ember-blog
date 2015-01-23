---
layout: post
title: "kick out the jams, motherfuckers"
category: code
date: 2012-04-30
tags: twitter, bootstrap, css, sass, sprockets
---

Well, I finally broke down and integrated [Twitter Bootstrap][twbs] with the existing UI of
my blog. To be fair, it DEFINITELY needed some work, and I just didn't have the time to get into the existing [Sass SCSS][sass] framework and figure everything out. But as Bootstrap [turned 2.0][twbs2], I found myself longing for a responsive UI (so I wouldn't have to "deal with" mobile), a standard reset, great typography defaults, and nice buttons/form elements to play with should I need them. The answer was simple. I *needed* Bootstrap.

Bootstrap is written in the [LESS][less] framework, which kinda sucks because I prefer SCSS since I work with [Rails apps all day][rails]. Thankfully, someone made [a gem][bss] that ports the Bootstrap framework over to Sass for easy modification. Now, if I want to modify the very variables and mixins that power the framework, I can do so. That's really cool.

Another sort-of invisible addition that I made that actually makes all this possible is I am now compiling all assets on the server side automatically using [Sprockets][ap], better known as "the asset pipeline" in Rails. It has all the same benefits as the asset pipeline...and all of its shortcomings as well (and then some!). My `config.ru` has gone through a heavy transformation based on [this gist I found][gist] for loading Sprockets and Bootstrap onto a non-Rails
application. Because I'm using Sprockets to dynamically load stylesheet, JavaScript and image assets, I can develop without recompiling the stylesheets every time. My JavaScript files are minified and compressed before going into production for optimal performance. All of this is happening with the power of Ruby and Rack. Since this static site is being served as a small Rack application, I can take advantage of the stack for logging purposes, compiling static assets, and possibly [other things coming soon down the pipeline][sx]...

Here's [a more detailed version][sha] of what was changed...

    Bootstrap in Sass provides a number of advantages over the previous
    buggy UI. A global, standard reset is in place as well as new
    typographic changes and spacing. We're also taking advantage of
    Bootstrap-2.0's "responsive" grid, and the site looks great in
    both desktop and mobile browsers of practically any size.

    I've also completely refactored the aging CSS framework into one
    based more on elements rather than roles. It is not complete yet.
    There's an additional file called "support" which is responsible
    for holding all mixins and variables.

    We are also now loading Bootstrap through Sprockets, thanks to a
    config.ru I ripped off of https://gist.github.com/2143990.

    CHANGELOG

    - fixed call to nonexistant task
    - refactored assets group
    - refactored rackup file for bootstrap-sass
    - added assets group to bundler setup
    - got rid of :framework and status_exchange in the rackup, using :default now
      for framework gems
    - integrated new css framework emphasizing element "classes"
      rather than roles into the markup, which has been modified to
      suit the new responsive bootstrap grid
    - removed the octopress folder
    - support partial for mixins and variables/colors
    - removed static bootstrap CSS
    - element based file name and changes to aside

Gotta give some shoutouts @mdo and @fat for building such an awesome CSS framework, Thomas McDonald for porting it to Sass, and @sstephenson for the amazingly useful Sprockets framework. Much love.

[twbs]: http://twitter.github.com/bootstrap
[sass]: http://sass-lang.org
[twbs2]: http://scripting.com/stories/2012/03/14/movingToBootstrap20.html
[less]: http://lesscss.org/
[rails]: http://rubyonrails.org
[bss]: https://github.com/thomas-mcdonald/bootstrap-sass
[ap]: https://github.com/sstephenson/sprockets
[gist]: https://gist.github.com/2143990
[sx]: https://github.com/tubbo/psychedeli.ca/tree/master/lib
[sha]: https://github.com/tubbo/psychedeli.ca/commit/10d39bd71e83aaa9e8b57f2b1b3f53b686bd94bd
