---
title: making private methods private
date: 2012-11-24
tags: ruby, experiment
category: code
---

So it's a well-known Rubyism that you can actually circumvent private and
protected restrictions on instance methods if you simply use the `send()`
method to access them. I wanted to see if it was possible to rewrite
`send()` on a particular class to throw an exception if the method attempting
to be accessed was a private method on the class.

**Oh yeah, this post is probably not safe for work...**

## how i did it

I started out with a simple class:

```ruby
class PrivateParts
  def initialize
    @boobs = "( . )( . )"
    @butts = "(  )(  )"
    @balls = "( )( )"
  end

private
  def peep_show
    @boobs + @butts + @balls
  end
end
```

In my test, I am asserting that a `NoMethodError` will be thrown if I attempt to
access the method, even with `send()`.

```ruby
require 'test/unit'

class PrivatePartsTest < Test::Unit::TestCase
  def test_peep_show_cannot_be_called_outside_of_the_class
    parts = PrivateParts.new

    assert_raises(NoMethodError) { parts.peep_show }
    assert_raises(NoMethodError) { parts.send(:peep_show) }
  end
end
```

This fails, until I overrode `PrivateParts.send()`...

```ruby
  def send(method, *args)
    if private_methods.include? method
      raise NoMethodError.new("private method '#{method}' called for #{self}")
    else
      super(method, *args)
    end
  end
```

What `send()` is doing here is checking against `Object.private_methods`, a collection of
method names that are all private. If a match is found, an error is thrown, because
somebody outside of the class wanted the data returned by `PrivateParts.peep_show`. Due to
Ruby's own clever scoping of the "actual" send method, overriding `send()` does not affect
the classes own internal behavior, as the private method can still be called as a private
member within the class. This is illustrated by the following test:

```ruby
  def test_peep_show_can_be_exposed_by_exposure
    parts = PrivateParts.new

    assert_equal "( . )( . )(  )(  )( )( )", parts.exposure
  end
```

And accompanying public method **PrivateParts.exposure**:

```ruby
  def exposure
    peep_show
  end
```

These tests both pass, since `peep_show` is not using `PrivateParts.send()` to do its bidding.
This override, being done in the "public-facing API" of the class, was scoped to just that
portion of the codebase. While this overrides Ruby's "code-as-documentation" appraoch and
enforces strict private members in a class, it actually takes advantage of such an approach
to provide the functionality in a language that does not provide it out-of-the-box.

## conclusion

This whole demonstration is available [as a Gist][gist]. As this is more of a demonstration
in meta-programming, if anything, I wouldn't recommend actually using it. This is of course
not an example of how I actually write my code. My personal beliefe is that such enforced
rules are unnecessary in the real world, and private/protected methods are simply there to
tell developers of an intended purpose for the method. It is almost never necessary to call
these methods in a test nor in an outside class, so a case such as this should probably never
come up, otherwise I think you may have bigger problems on your hands...

[gist]: https://gist.github.com/4141173
