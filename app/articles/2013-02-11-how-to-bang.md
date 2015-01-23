---
layout: post
title: how to bang...like a boss
category: code
date: 2013-02-11
tags: ruby, bang, conventions
---

In the Ruby programming language, there exists two characters you are
only permitted to use when naming a method: **?** and **!**. These
special permissions are designed to allow you to establish a certain
level of convention in your method naming, for example, a method ending
in "?" in Ruby is mosty likely always going to return a Boolean response
of true or false. Not only is this convention not questioned much, but
there seems to be very little sensible use out of making a "?" method
not return a boolean response.

Unlike the "?" suffix, which has an established and unchallenged purpose
within the Ruby community, "!" is a lot less cut and dry. In ActiveRecord,
for example, "!" is added to methods like `save()` and `create()` when you
want an Exception to be thrown in the case where those methods fail to
execute properly. It's easy enough to add the "!" to those methods when
you need to change the nature of your business logic, or perhaps you wish
to capture the Exception so you can raise a new one overtop of that
error case.

```ruby
# app/models/post.rb
class Post < ActiveRecord::Base
  validates_presence_of :title
end
```

```ruby
# app/controllers/posts_controller.rb
def create
  model = Model.create! # => throws ActiveRecord::ValidationError
end

def create
  model = Model.create # => just returns 'false'
end
```

But Ruby, on the other hand, uses "!" to denote when you're mutating the
object that you're calling the method on. This is an entirely different
use case from Rails, yet this use case also seems to make sense on a
syntactic level:

```ruby
starter = { foo: 'bar' }

newer = starter.merge(baz: 'bat') # => returns a new Hash: { foo: 'bar', baz: 'bat' }

starter.merge!(baz: 'bat') # => merges in { baz: 'bat' } to the starter Hash instance
```

## bang is the yolo convention

At eLocal, we use "!" as a generalized YOLO convention. It means we're
about to execute some actions which may fail, or are connecting to an
outside resource (such as an API or our mothership site) In either case,
the "!" dictates that our app's control flow should stop.
