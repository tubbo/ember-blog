---
layout: post
title: a case for scopes
category: code
date: 2013-03-08
tags: rails, ruby, active_record
---

There has been a lot of hate towards [scopes][ars] recently. I'm here
to tell you that scopes aren't all bad, and they can be used to create
some astonishingly elegant model definitions.

Consider the following bit of code:

```ruby
# Events fired by Sendgrid that tell us more information about Messages
# we send out on a daily basis. We only respond to a number of
# +EVENT_TYPES+, but they tend to tell us everything we need to know
# about the messages sent out at this time.
class MessageEvent < ActiveRecord::Base
  # The types of Sendgrid events we will be responding to. We are mostly
  # saving events that tell us when a problem has occurred with message
  # delivery, but we do have a 'delivered' event in there so we can keep
  # track of sunny-day message delivery. +View source+ below to see the
  # events we're tracking.
  EVENT_TYPES = %w(bounce delivered dropped spamreport unsubscribe)

  # 'Bad' events trigger a red message icon on the front-end. The
  # bad events include when a message bounced, was dropped, the user
  # unsubscribed to the list, or they marked the message as spam.
  #
  # Only one recipient has to mark a message as 'bad' in some way
  # for it to be considered bad by the system.
  BAD_EVENTS = %w(bounce dropped spamreport unsubscribe)

  # 'Good' events trigger a green message icon on the front-end, and
  # a message is considered good when all recipients fire back with
  # 'delivered' events.
  GOOD_EVENTS = %w(delivered)

  validates :event, presence: true, inclusion: { in: EVENT_TYPES }

  scope :recent, -> { order 'created_at DESC'  }
  scope :bad,    -> { where event: BAD_EVENTS  }
  scope :good,   -> { where event: GOOD_EVENTS }
```

As you can see, this is a relatively clear model definition. It only
consists of code pertaining to the data model, or configuring the
validations made just before insertion into a database. We have a number
of constants defined, as well as some scopes...but no class methods.

I've avoided these for a reason. **I don't like the way they look.**

Now this is an obviously stupid reason to cut out code that makes
your code more understandable in the long run, and if it's a case
where you're sliming in lambdas and trying to make your code look
"pretty" even though it's surrounded by a million formal brackets,
you're probably not using scopes correctly. But as you can see
above, writing those definitions in any other way is not only
way more verbose than it needs to be, but is unnecessarily adding
lines and decreasing readability usually for the sake of some other
purpose.

Typically, people who preach against the use of scopes tell me that
scopes rob you of the ability to document methods. Let's look at the
model if I used class methods, and give them some extra documentation.

```ruby
# Events fired by Sendgrid that tell us more information about Messages
# we send out on a daily basis. We only respond to a number of
# +EVENT_TYPES+, but they tend to tell us everything we need to know
# about the messages sent out at this time.
class MessageEvent < ActiveRecord::Base
  # The types of Sendgrid events we will be responding to. We are mostly
  # saving events that tell us when a problem has occurred with message
  # delivery, but we do have a 'delivered' event in there so we can keep
  # track of sunny-day message delivery. +View source+ below to see the
  # events we're tracking.
  EVENT_TYPES = %w(bounce delivered dropped spamreport unsubscribe)

  # 'Bad' events trigger a red message icon on the front-end. The
  # bad events include when a message bounced, was dropped, the user
  # unsubscribed to the list, or they marked the message as spam.
  #
  # Only one recipient has to mark a message as 'bad' in some way
  # for it to be considered bad by the system.
  BAD_EVENTS = %w(bounce delivered dropped spamreport unsubscribe)

  # 'Good' events trigger a green message icon on the front-end, and
  # a message is considered good when all recipients fire back with
  # 'delivered' events.
  GOOD_EVENTS = %w(delivered)

  validates :event, presence: true, inclusion: { in: EVENT_TYPES }

  # Order events by the date they were received.
  def self.recent
    order 'created_at DESC'
  end

  # Find all events where the 'event' is included in +BAD_EVENTS+.
  def self.bad
    where event: BAD_EVENTS
  end

  # Find all events where the 'event' is included in +GOOD_EVENTS+.
  def self.good
    where event: GOOD_EVENTS
  end
```

My belief is in this class, I've added about 9 lines of useless code
and useless documentation. As you can see, I've clearly documented
the constants `EVENT_TYPES`, `BAD_EVENTS` and `GOOD_EVENTS`, because
this is what data really matters. As we're in a Rails 3 ActiveRecord
environment for this case, it's pretty common to chain scopes together
to form larger queries when you need them, and so far nothing functionally
has changed with this example. But my point here is I've added about 9
lines and that really hasn't improved the readability of my model.

In fact, I argue that it has *decreased* the readability in this case.
When I had my scopes set up, it was 3 lines and with the exception of
the lambda surrounding each query clause, there was not a single bit
of "baroque" code (e.g., syntax that has nothing to do with readability,
but is necessary for the compiler to understand what's going on). Given
you're a reader of the source code, as most professional Ruby developers
tend to be, you'd see the scopes clearly laid out and *most* likely if
you needed them, they'd be easy to understand. The documentation for
the scope sort-of "writes itself", in this case, so there's really no
need to over-document those class methods which hopefully won't be used
by most people outside of the class.

As `MessageEvent` is a support model for `Message`, we're assuming that
most interaction with events comes through the Messages interface, and
since there's no need to design a crazy search system for events at
this time (hopefully ever), I'm pretty confident that the "scope" (hah!)
of this particular problem won't be changing anytime soon.

So just to wrap it up, I feel confident that those 3 lines of `scope`
macros are just as effective as writing the methods as actual class methods,
and furthermore, increases the readability of the entire class definition.
This does come at the expense of lacking documentation for methods that
are public and *do* exist on your class (breaking some rule I'm sure), but
my arguement is that this is not always needed.

Use your own judgement. If you feel like your scope is getting too complex,
or you're writing a scope with the express purpose of having others/yourself
use it outside of the domain of this model (or its original design), you
might want to give yourself the freedom of documenting it further by
turning it into a class method. Regardless, it's up to you, and I'm glad
that Rails gives me the option to make my code more elegant, because it has
caused me to attempt to simplify my design patterns and streamline my
model definitions to only deal with the data model itself.

[ars]: http://guides.rubyonrails.org/active_record_querying.html#scopes
