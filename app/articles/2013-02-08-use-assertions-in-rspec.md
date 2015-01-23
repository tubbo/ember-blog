---
layout: post
title: use assertions in rspec
category: code
date: 2013-02-11
tags: rspec, ruby, testing, test_unit, bdd, tdd
---

# tl;dr -- you can do MiniTest::Assertions inside RSpec examples.

A few years ago, [RSpec][spec] was extracted from the [Cucumber][cuke]
project as a separate entity for BDD and testing with natural language
in Ruby apps which may not need all of the weight of Cucumber. It gained
traction pretty much everywhere, but it's primary evangelists were
Rails developers (well, [except DHH][drama]), and in the Rails community
it was commonly used. But two years ago, DHH lit the spark that would
become a major debate and one that "divides" Rails developers all over
the map. DHH argued that [test_unit is all you will ever need][dhh] for
testing a Rails application. And he's basically right, because you can
`rails generate model {something` and then `rake test` and watch the
assertions run.

## why don't people use rspec?

RSpec is a pretty strange testing framework to work with if you're used
to doing assertions and unit-testing each component of your application
with the built-in `Test::Unit` library. `Test::Unit`, and it's successor,
[Minitest][test], was designed primarily as a unit testing framework at
its most basic level. Since it's included in the Ruby standard library,
it needs to follow the paradigms of how Ruby classes are designed by
doing one thing, and one thing well. You're meant to add other libraries
such as [Mocha][mocha] and [Turn][turn] to give `Test::Unit` more
functionality, or make it easier to read. These libraries all have their
quirks, and tests written for basic `Test::Unit` tend to fail in strange
ways when adding these other libraries on top of them, so typically
users of Minitest or test_unit won't be keen on installing a lot of "sugary"
plugins that could introduce a bug in the test suite.

## the problem that rspec solves

If you completely divorce yourself from RSpec's syntax and the framework
which surrounds it to provide a killer testing experience, you realize
even less reasons to use Minitest. Speed and efficiency aside, RSpec gives
you a lot of sensible defaults and configuration options just for modifying
how its returning results to you. Don't like colors? Turn 'em off. How about
the way it just shows you every test's name? Try `--format=dot` to make large
test suites easier to read. Or better yet, use `--format=progress` for really
big test suites where you need to see the health of all tests but don't need
to necessarily see which tests fails immediately in real-time.

Tools like [vim-vroom][vroom] were built for RSpec. [Gary Bernhardt's vimrc][gbv]
is designed for RSpec and works best when you're not constantly switching between
Minitest and RSpec. It's more reliable to run single tests and single examples
with RSpec, because you don't need a special shell alias or *not* use things
like Turn which muck with the actual name of the `test_method` you developed.

## have your cake and eat it too

You can take advantage of these lovely niceties of RSpec, without having to
write in that nasty syntax! Since RSpec is just syntactic sugar overtop of
`Test::Unit`, there's nothing stopping you from writing:

```ruby
it "should pass" do
  assert true, "not true"
end
```

So why are you screwing around with `Test::Unit` and Minitest's difficulties and
caveats? Just use RSpec. And make your life easier.

[spec]: http://github.com/rspec/rspec
[cuke]: http://cukes.info
[drama]: http://www.rubyinside.com/dhh-offended-by-rspec-debate-4610.html
[test]: https://github.com/seattlerb/minitest
[mocha]: http://mocha.rubyforge.org
[turn]: https://github.com/TwP/turn
[gbv]: https://github.com/garybernhardt/dotfiles/blob/master/.vimrc
[vroom]: https://github.com/skalnik/vim-vroom
