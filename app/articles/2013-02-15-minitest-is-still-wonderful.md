---
layout: post
title: minitest is still wonderful
category: code
date: 2013-02-15
tags: ruby, minitest, rspec, tdd, bdd
---

So after posting my [article on how to use assertions in rspec][ass], I
was involved in a discussion with [@cheapRoc][jr] over the discovery
that indeed assertions do work within the context of RSpec. To my
surprise, it seemed [@seattlerb][zen] was following at least one of us
and overheard our conversation, mistaking [my quite hyperbolic statement][oops]
for a diss on Minitest.

This was not the case. I still love and use Minitest every day.
[This blog is tested using Minitest][tests], and we use Minitest at work
to run a giant test suite that takes over a half-hour to complete
(*without* the smoke tests!). What has happened here is a colossal
misunderstanding on my part about what Minitest actually is. Basically,
I was under the impression that Test::Unit had been totally and
unabashedly replaced by Minitest when Ruby 1.9 was released. While
the Test::Unit class names and assertions remained the same, (as
they had in Minitest which was concieved of as a drop-in replacement
for the slower Test::Unit in Ruby 1.8), it seems that Ruby 1.9's
[Test::Unit is inspired by, but not exactly Minitest][exp]. From what
[@seattlerb][zen] is saying, it seems as though Test::Unit needed
to mostly stay compatible with existant Ruby 1.8 programs and so the
new Test::Unit was developed to address the problems of the older
version, and as a side effect introduced new inconsistencies and
problems when migrating between Test::Unit and Minitest.

My blog post was geared towards people who want to make Minitest look
just like RSpec, and behave in the same ways, solely because they prefer
the syntax of Minitest to the syntax of RSpec. There are definitely
times where assertions just make more sense, visually, than matchers.
Basically, I don't believe there's a reason to toil with juggling 5
different gems that make your assertion-based testing framework behave
just like RSpec. RSpec is a complete package, you install it and it
runs with sensible defaults that make your tests look good and easy
to read.

At the same time, it's good to know that tools such as Minitest are
there for when you don't need all of that extra fluff in your tests.
Maybe you're just testing a little shell-script that you wrote in
Ruby and you could practically use Test::Unit if you so desired,
but maybe you have the ability to load in extra gems so Minitest
would definitely improve your life.

[ass]: http://www.psychedeli.ca/2013/02/08/use-assertions-in-rspec
[jr]: https://twitter.com/cheapRoc
[zen]: https://twitter.com/seattlerb
[oops]: https://twitter.com/tubbo/status/302147170251993089
[tests]: https://github.com/tubbo/psychedeli.ca/tree/master/test
[exp]: https://twitter.com/seattlerb/status/302206878392401920
