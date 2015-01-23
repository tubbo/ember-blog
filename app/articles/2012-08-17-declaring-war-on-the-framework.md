---
layout: post
title: declaring war on the framework
category: code
date: 2012-08-17
tags: #rails, #refactoring, #ruby
published: true
---

Most of my time at my current job has been spent refactoring our
affiliates API. When I started, it was a series of disorganized Rails
apps in a single Git repo, one solely for the backend and meant to push
sales leads to our main web application, and the other solely as a
frontend "dashboard" to that API, where the affiliates and the folks
working in operations can see statistics on and make changes to
affiliate accounts. In order to accomplish this, the past programmer had
the genius idea of separating out the entire model structure into a gem,
which further complicated the matter, leading to strange errors,
security flaws, and flat-out unimplemented garbage code.

## The Pre-Game Show

Before I began reworking the API, I was told to completely rewrite the
email parser engine (from scratch, [don't ever fucking do this][joel]). 
It was originally written in C++, but I had to implement in Ruby ostensibly 
so other developers could help out with adding features down the road.
This never happened, of course, because every time there needed to be something
added or a bug needed to be fixed, nobody wanted to tackle the problem
based on bad experiences in the past with this codebase. It took months
of agony before we finally had a stable, working version that didn't
crap out all the time or send everyone 100 alert emails a day. For the
same reasons as Joel points out in the article I linked, rewriting a
codebase from scratch is always going to be painful. Most likely, the
bugs and misunderstandings that took me a lot of stress and energy to
work out were already taken care of in the C++ version of the parser.

## Don't fight the framework, declare war on it.

A lot of the confusion and deployment difficulties we had while working
with this API could have probably been averted if the developer who
worked on this project previous to me heard this simple phrase: "don't
fight the framework".

When working with frameworks such as Rails, which change the way you
code in Ruby, your choices become more limited as to how you can (or
should) implement something. For example, it's against the ethos of MVC
and Rails to perform database saves and complex logic in the view layer
of your application. It's very common for developers to ignore this, and
simply go on hacking away at something where a much more elegant,
test-able and robust solution can be found by simply learning a bit more
about how their whole ecosystem works.

I think this doomed strategy of solving small issues has its roots in a
larger, more psychological problem...

## Being "that guy"

As a musician, I tend to think of my relationship with co-workers on a
creative team in similar ways to how I treat the members of my band. As
the bandleader, I'm responsible for coordinating rehearsals/gigs and
managing the operations of the band as well as conducting performances
and sometimes cueing parts to be played. Sometimes, there's a guy in the
band who simply doesn't "get it". He can't seem to fit himself in to the
sound of the whole band, and blend the sound of his instrument with that
of everyone else. And by the way, for the P.C. crowd...I am purposely not 
representing the female gender, because I rarely meet women who do this.
I'm not sure if that's because there are typically more men than women
who play jazz instruments, which is the kind of musician I recruit for
[The Wonder Bars][wb], or if it has something to do with how women
approach this problem. But anyw, it's been 100% men who do this in my
own personal experience.

"That guy" is not a good guy to be. When push comes to shove, a guy like
that can't be in a musical project that relies on the group being tight
and having a specific sound. He is typically unaware of his
actions, and is typically quite butthurt by his forced departure and
hearing of how he's been behaving. In bands which don't cycle through
performers, this is an even bigger problem because it is much more
expensive to fire someone and replace them than it is to mend a
relationship between two band members, from a logistical standpoint. In
other words, it's a lot less work on *my* part if the entire band works
with "that guy" to help him blend his sound in. But sometimes, it just
doesn't work.

Why am I telling you this? **Because the former developer that built this
API didn't know how to be a part of a team.** He built things that only he
knew how to fix. He wrote in languages that no one else on the team
understood, or understood to a point that they would feel comfortable
writing (or even worse, debugging) an application of some kind.

The big kicker to all this? "That guy" decided, in his infinite wisdom,
that email parsing wasn't possible with standard Ruby, and so he
utilized C++ and the [chilkat][ck] library to do all the parsing. While
it did run quite fast, no one else on the team before or since knows C++
enough to debug someone else's (probably horrible) codebase. This is the
only reason I was introduced to the project in the first place, and it
turns out that an email parser is **really, really easy** to write in
Ruby. So whatever bullshit was spewing out of his mouth was just that,
and most likely his real motivation for writing it in C++ is just
"because he could". We must remember, however, that **just because you can, 
doesn't mean you should**. In this case, this motivator for his
decision-making cost the company thousands of dollars and backtracked
our entire development effort a bit, because I can't work on the main
app while I'm banging out bugs, developing new features, or refactoring
the API's existing codebase.

Here's an excerpt of his CoffeeScript code that took me two days to
debug. For reference, I rewrote this code in about an afternoon:

    bt = (f) ->
      w "<div class='elapibutton' id='elapibutton_" + ak + f + "'><a class='elapisubmit' id='" + ak + f + "' href=\"javascript:e_" + f + "_();\">&nbsp;</a></div>"
    czti = (f) ->
      w "<img class='elapi' src='' id='" + ak + f + "' style=\"display:none;\">"
    imt = (fa, fi) ->
      w "<div class='elapipoweredby'><a class='elapi' href='' id='" + ak + fa + "' target='_blank'><img class='elapi' src='http://<%= request.host %>/images/pixel.gif'></a></div>"
    img = (f) ->
      w "<img class='elapi' id='" + ak + f + "' src='' border='0'>"
    lmid = (f) ->
      w "<div class='elapi' id='" + ak + f + "'></div>"
    anc = (f,v) ->
      w "<a class='elapi' id='" + ak + f + "'>" + v + "</a>"
    lti = (f, v) ->
      @zts = -1
      f.attr "src", "http://<%= request.host %>/v1/" + fv(apk) + "/zipvalidate/" + v
    rmvc = (f) ->
      fe(f).css "background-color", "#FFFFFF"
    pf = (v) ->
      tv = v
      tv.replace(/\(/g, "").replace(/\)/g, "").replace(/-/g, "").replace(/\./g, "").replace " ", ""
    vp = (v) ->
      l(v) == 10 and isnm(v)
    cpops = ->
      w gops()
    gops = ->
      hm = ""
      catid=""
      $ea.each aks.it, ->
        catid = @ci if @k is fv apk
        #catid = aks.it[0].ci if catid is ""
      hm += "<option value='0'>Select Need</option>"
      $ea.each cps.it, ->
        hm += ("<option value='#{@oi}'>#{@n}</option>") if @ci == catid
      return hm

Seriously, who the fuck wants to go through that and figure out, line by
line, what it does? All because of an idiotic, non-informed decision to
keep everything "terse" for "smaller file size". These kinds of
decisions, made entirely inside one programmers head, are signs that the
developer in question is not aware of or doesn't understand how to work
with a team. Perhaps he didn't feel comfortable with his team, or there
were other reasons why he chose to code this way, but in any case they
are causing massive problems for me. Because it would take far too
much time to go through this code and refactor its potential issues, 
I can only hope that it continues to work as we continue development on 
the API.

Before I [touched the code][dtmc], the JavaScript that controlled this
was building the HTML form from scratch, and was about 170 lines of
code. By not fighting the framework, and rather letting Rails take care
of asset packaging and template rendering (you know, the shit it's good
at?), I was able to reduce the code footprint to about 35. That means
that the code I was working with was ~4x bigger than it could have been.
Not only that, but simply making an Ajax call to an HTML endpoint
instead of building everything in JS is less buggy, and it allows us to
take advantage of the nice server-side view layer stuff like Haml,
helper methods, and Rails' ActionView module. Working in Rails is just
depressing if you can't use this shit.

Oh, did I mention that *all* of the static assets previously used in this 
widget were in **app/views/script**, and they were all ERb so he could 
interpolate `<%= request.host %>` into the code. Yup.

## Reversing This Hell

So as I continued to toil on the API, I decided that my ultimate goal on
this project is to refactor it so the entire team could simply jump in
and begin working. In order to do this, a few things had to happen:

1. Everything needs to be combined into a single Rails app. 
2. Data from the MongoDB collection(s) that formerly powered the API
   must be converted to PostgreSQL, with preserved relationships.
3. Must integrate with Jenkins, our CI server, and our other
   development tools Airbrake, Pivotal Tracker and Flowdock.
4. Implement a tag-based release system and deploy based on
   those tags, so we can better manage API versioning and the user can
   always see what version of the API we're working off of (with
   documentation and an affiliate-centric changelog to boot)

### The Big Squeeze

We like to follow the "Pattern Of Least Expectation", and since most of our
repos contain single Rails or Rack apps, why would we break from that
convention for the API? Thankfully, the 3 apps in the repo were
themselves Rails apps, or meant to work with a Rails app, so it was
simply a tedious process of moving code around and running the test
suite. It was quite easy, actually, to move everything into a single
app since we used the same model structure (in a Gem) for both apps.
Almost as easy as, you know, DOING IT IN THE FUCKING FIRST PLACE.

This was accomplished in a fairly clever way. @iotr and I created a Rake
task that looked at the MongoMapper model definitions, found where the
attributes were declared, and executed `rails generate model` for the
downcased name of the class. We also use these definitions to generate
the temporary table schema, since it also holds crucial database field
=> type mapping information...

    data = %x(for f in `grep -Rl 'MongoMapper::Document' vendor/elocal_affiliates_data/* | egrep '.rb$'`; do echo `basename $f`; echo `egrep '^ *key' $f| awk '{print $2 $3}' | sed 's/[:,]//g'`; done)
    count = 270171
    model_name = "?????"

    # Create temporary tables of Mongo data 
    data.split("\n").each do |line|
      # print the last model on each new model name encounter
      if !!line.match(/\.rb/)
        model_name = line.gsub '.rb', ''
      else
        # translate mongo class into attribute type
        line.gsub! /String|ObjectId/, " VARCHAR(255),"
        line.gsub! 'Integer', " INTEGER,"
        line.gsub! 'Float', " DECIMAL,"
        line.gsub! 'DateTime', " TIMESTAMP,"
        line.gsub! 'Boolean', " BOOLEAN,"
        line.gsub! 'user', "user_id"

        %w(description full_body raw_post questions).each { |text_attr|
          line.gsub! "#{text_attr} VARCHAR(255)",  "#{text_attr} TEXT"
        }

        query = "DROP TABLE IF EXISTS tmp_#{model_name.pluralize}; CREATE TABLE tmp_#{model_name.pluralize} ( #{line.chop}, _id VARCHAR(255), created_at TIMESTAMP, updated_at TIMESTAMP );"
        puts query
        postgres.exec query
      end
    end

    # Generate Rails models
    data.split("\n").each do |line|
      # print the last model on each new model name encounter
      if !!line.match(/\.rb/)
        model_name = line.gsub '.rb', ''
      else
        # translate mongo class into attribute type
        line.gsub! /String|ObjectId/, ":string "
        line.gsub! 'Integer', ":integer "
        line.gsub! 'Float', ":float "
        line.gsub! 'DateTime', ":datetime "
        line.gsub! 'Boolean', " :boolean "
        line.gsub! 'user', ":references "

        %w(description full_body raw_post questions).each { |text_attr|
          line.gsub! "#{text_attr}:string",  "#{text_attr}:text"
        }

        sh "rails generate model #{model_name} #{line}"
      end
    end

This script will build temporary tables based on every MongoMapper model
you have in a certain directory. It will then generate Rails models for
each of those MongoMapper models. In short, these two loops are what
translates MongoMapper class information into a database schema and
model structure. Doing this requires that your MongoMapper models are in
a different directory from app/models, so it may be a good idea to `mv
app/models vendor/models && mkdir -p app/models` before running this
script. At eLocal, we ran this in a Rake task.

### The Data Translation

I'll spare you guys the entire code for the "real import" task, because
it is rather long and tedious. We ran a SQL query that `INSERT`ed into
the "app table" (that is, the table generated by the model which we will
be using in the application) the contents of our temporary tables, which
are prefixed with "tmp_". It turns the `_id` column on all tables into
`bson_id`, and sets up the reference columns for other models by their
relational ID. It is important to run these scripts in a specific order,
from the least amount (or 0) of associations to the model dependent on
the most associations. We wrote similar queries for each model, and ran
them all in a Rake task.

Here's the formula for all of the SQL queries which performed this task:

    TRUNCATE models; 
    INSERT INTO models(name, relationship_id, bson_id, created_at, updated_at)
      SELECT name, tmp_models.name, relation_models.id, _id, COALESCE(tmp_models.created_at, NOW()), COALESCE(tmp_models.updated_at, NOW()) 
        FROM tmp_models 
        LEFT JOIN relation_models ON relation_models.bson_id = tmp_models.relationship_id;

When that task is written, the database will be magically populated with
all of the information from Mongo, except instead of tying everything
together with the `BSON::ObjectId`, we are using numerical IDs generated
by Postgres. This lets the Mongo database once again "fit in" with our
Rails app.

When these Rake tasks are run side by side, they do a complete
conversion of the MongoDB collection into a Rails-ready SQL database.
Because the API will be live when we're migrating to the new server, we
need to make sure we're dropping as little data as possible. 

## Migrating a Live API

Our API gets a good bit of usage, and what's worse is that we didn't
have monitoring tools set up to track when leads were coming through
and when they're not (we do now, thanks to @fromonesrc's Graphite/StatsD
skillz). So we had to assume a few things about the big API move:

1. We will probably lose some data in the transition.
2. There will be clients attempting to connect to the old server when we
   make the call to move DNS to the new box.
3. There will be bugs when moving to the new infrastructure.

### Putting The Pieces Back Together

To effectively launch the new API, I had to sit with [Chef][oc] for about
2 and a half weeks and figure that shit out. It's not very simple, but
Chef is an incredibly powerful tool for managing server configuration
and launching new server instances. With our extensive use of
[Amazon Web Services][aws], Chef has proven to be a perfect companion in
DevOps, like when EC2 instances randomly terminate or an availability
zone goes down. But perhaps its most powerful asset is it's introduced
us to a whole new realm of knowledge about how all this stuff is being
deployed behind-the-scenes. Chef makes us all aware of the way our
servers are set up, and may shine some light into potential design flaws
or inconsistencies with our network.

With all the complex systems happening here, it's nice to know that
someone, somewhere has simplicity in mind. The **Amazon Elastic Load
Balancer** is an incredibly simple means of creating a load balancer,
and essentially enables 0-downtime deployments at all times (even in
fatal failure situations). Not only that, but the load balancer allows
us to experiment with horizontal scaling of our EC2 infrastructure.

So in order to deploy the API, I set up its infrastructure to use a
single load balancer and API server. Since we don't get *that* much API
traffic right now, I kept it simple and only put one EC2 instance on the
load balancer. With the load balancer and Chef EC2 instance in place, it
was time to test the API. To do this, I used `/etc/hosts` to "trick" my
machine into thinking `live.api.elocal.com` had a DNS configuration that
pointed to the load balancer. When I loaded the page locally, I was
greeted by the new API, with a version tag number displayed in the
footer for good measure.

With Rails' testing framework, Cucumber and RSpec, I was able to
effectively make sure that our clients would not notice any sort of
downtime or difference when posting their leads to our backend.

### They'll Never Know What Hit Them

Losing data is never a good thing. So when moving the API over, we
wanted to make sure that ideally 0% of the data gets lost. That's
(probably) not going to happen, but it's still a good idea to shoot for 
that. Our data loss was pretty much negligable because of our deployment
speed and the fact that everything was "set in place" before the actual
movement happened, so basically all we needed to do was to "flip a
switch". But there's still an elephant in the room: DNS.

DNS is a tricky thing. It's never quite certain how long it will take
for all of the nameservers to propagate changes across the Internet, and
different locations may yield different results. To get around this
problem, we used Apache's `mod_proxy` to silently forward requests from
`api.elocal.com` to the new EC2 load balancer box. Simultaneously, we
wrote a new `CNAME` record for the api subdomain that points to the new
load balancer. When both are in place, all API requests, new and old,
are forwarded to the new load-balanced API server, which is running the
new codebase.

## What's Next?

After the widget rewrite, we're going to take a second look at the email
parser. We may even implement some kind of [Bayesian][bf] filtering to
increase our chances of the parser mapping legal need to the proper
fields in our backend. But perhaps the most integral of all this is to
deprecate a direct relationship between the IMAP inbox and the Rails
app. By taking advantage of [Sendgrid's Parse API][sp], we can simply
create an `EmailLeadsController` to handle incoming emails, which will
pass off the Hash to a `Mail::Message` that the `EmailParser` can
accept.

## Conclusions

This process, while kinda scary, was a complete success. In fact,
everything was done in the moment, so the least amount of data was lost
in transit. Meaning that, all in one big command, we imported Mongo to
Postgres, converted the schema to something Rails could understand, and
restarted the Nginx server with the new configuration. (Thanks
Capistrano) At the same time, the COO updated the DNS configuration to
point to the ELB, and the conversion was complete.

All in all, I learned a LOT about how to properly do maintenence on
systems while they're still operational, and I learned a bunch of what
NOT to do with a Rails app. Namely...

- Don't rewrite anything until it becomes a last-resort option (i.e.,
  debugging would take more time than rewriting)
- Don't fight the framework. If you're hacking too much at Rails to get
  your code working, you're probably doing it wrong.
- Chef is annoying sometimes, and difficult to debug, but it's an
  indispensable tool for managing server configuration.
- There are companies that actually sell C++ libraries. Libraries! And
  what's worse, **there are companies that BUY these libraries!**


[joel]: http://www.joelonsoftware.com/articles/fog0000000069.html
[wb]: http://thewonderbars.com
[oc]: http://www.opscode.com/products/
[aws]: http://aws.amazon.com
[ck]: http://www.chilkatsoft.com/cpp_libraries.asp
[bf]: http://en.wikipedia.org/wiki/Bayes%27_theorem
[sp]: http://docs.sendgrid.com/documentation/api/parse-api-2/
