---

layout: post
title: "the role of the ajax call"
category: code
date: 2011-12-11
tags: ajax, javascript, rest, php
published: false
---

I wanted to touch a little on this topic in public because I feel it's something many Rails developers don't get about JavaScript. This was inspired by an email I got, as well as countless discussions I've had with both my co-workers and fellow programmers I've helped out on IRC. I think a lot of programmers could benefit from this information so you don't run into this issue yourself.

## The Ajax request.

It's really nice, isn't it? You can do a lot of things with it, you can even download other JavaScript code asynchronously and execute it. This has proven, however, to be somewhat dangerous. While reviewing my co-workers' CMS code to find out why it was spitting errors out all the time, I noticed that he was constantly passing JavaScript in Ajax requests back and forth and expecting them to execute properly. While at one time they may have, for some reason now they get errors like `$ is not defined`, even though `jquery.js` is right there in the Net panel of Firebug. What it boiled down to was that our browser (Firefox) was refusing to allow access to previously loaded libraries on the page to Ajax-requested JavaScript.

This was an example in PHP, but Ruby on Rails also suffers from this potential disaster. Rails developers can create `.js` files that their views respond Ajax requests to. Typically, these files are JavaScript code segments that are supposed to be executed when they run. But they don't always get executed like that. Sometimes, the browser refuses to load the library, and other times the JavaScript simply fails to run, even though it's in the page. It's as if it was plain text, but not being displayed because it's in a `<script>` tag. This entire post was inspired by an email I got from a Rails developer attempting to pass JavaScript code and HTML simultaneously in a modal dialog. He was using the Rails JavaScript view system, a now deprecated means of transferring data between the Rails application's controller and helper layers and the JavaScript logic on the view layer.

## Our Solution

We decided to solve this by changing the way we wrote Ajax requests in the CMS. It was much more efficient to use Ajax as a static data transfer mechanism, rather than a means of transferring logic code between files. So instead of getting back `<script>` tags with code in it, we got back JSON data and used that to execute that segment of JavaScript code. PHP makes this easy, as it allows any Array to be encoded into valid JSON. So what we did was respond with something like this

```php
<?php
  header('Cache-Control: no-cache, must-revalidate');
  header('Content-type: application/json');
  $response = array(
    'status' => "success",
    'markup' => '<div class="success">Successfully saved changes to the file.</div>'
  );
  echo(json_encode($response));
?>
```

Instead of merely `echo`ing that HTML in a String, we are wrapping it with JSON and returning that. Notice that you need [special HTTP headers][phpjson] to return a valid JSON response, some browsers attempt to guess based on the content but you can't really rely on that. To ensure that the browser is interpreting this response as JSON, you must specify the HTTP `Content-Type` as **application/json**. I've also included a `Cache-Control` directive which forces the browser to reload the content every time it loads. This ensures that browsers won't cache these requests, because your data is always changing.

So now, we can write some JavaScript to process that data. We like to use the [jQuery.form][jqform] plugin [at the office][aplusl]...

```javascript
<script>
	$('#saveForm').ajaxSubmit({
		url: 'ajax/saveChanges.php',
		dataType: 'json',
		success: function(response, xhr, status) {
			$('#status').append(response.markup).slideDown(400);
			setTimeout(function() { $('#status').slideUp(400); }, 5000);
		}
	});
</script>
```

That extension to the [jQuery][jq] library simply submits a form asynchronously, and its `options` Object lets you bind actions to the various `jQuery.ajax` callbacks.

## A little philosophy

So now you know the code, but it's time to learn about why exactly I chose to do it this way.

### Ajax is for transferring data, not logic

You can boil every Ajax call down to one formula: send request, receive response, execute callback(s). This is, after all, the basic format of an HTTP request. Knowing this, you can design your Ajax requests to simply be informational, then when a response is received you execute the JavaScript inside its success callback. This may be a bit confusing to debug, but it's a little easier if you extrapolate every call to a function in the same external .js file, and name your functions by the action they perform. This ensures an application that performs exactly as you expect it. You'll never have to hunt through HTML code in an Ajax response, nor will you ever have a question as to what type of content you're getting from this particular HTTP request.

### Standardize your JSON response

Once you've gotten this pattern down, it's important to keep a standard practice when creating your JSON responses. Lets say you want to `GET` an object, like a Post, from your blog. Fortunately, you've written a small PHP script that will return it from the database. Let's just say, for shits and giggles (and because it's almost 2:00am and I don't feel like writing it out), that this PHP script works and returns the following JSON response:

```php
<?php
	$id = $_GET['id'];
	$sql = "SELECT title, body FROM `posts` WHERE `id` = '$id'"
	$response = mysql_query($sql, mysql_connect('localhost', 'user', 'pass', 'database'));

	if (count($response)) {
		echo json_encode($response);
	} else {
		echo json_encode(array('message' => "Error: Shit don't work!"));
	}
?>
```

Right now, this doesn't follow a standard practice. `response.message` would have to be tested on the client side to see if this is an error or not. That's no way to do business, especially if you may need multiple messages or styles for each message. A better way to create this JSON would be to do

```php
<?php
	$id = $_GET['id'];
	$sql = "SELECT title, body FROM `posts` WHERE `id` = '$id'"
	$post = mysql_query($sql, mysql_connect('localhost', 'user', 'pass', 'database'));

	if ($id && count($post)) {
		$response = array(
			'type' => 'success',
			'post' => $post
		);
	} else if (count($post)) {
		$response = array(
			'type' => 'warning',
			'message' => "Post not found"
		);
	} else {
		$response = array(
			'type' => 'error',
			'message' => "No ID passed"
		);
	}

	header('Cache-Control: no-cache, must-revalidate');
	header('Content-type: application/json');

	echo json_encode($response);
?>
```

We know that if `response.type` is "success", then `response.post` will be defined and we can work with it. But if `response.type` is "error", we will know that `response.message` is defined and we need to display it. The JavaScript can use a `switch` statement to parse other types of messages like "warning" or "info", which we may use in the future. Altering your JSON responses to be standard now will save you much testing and coding time in the future. Observe how much more informative these error messages are, and how much more flexible your code is after this alteration.

[jq]:http://jquery.com
[phpjson]: http://snippets.dzone.com/posts/show/5882
[jqform]: http://jquery.malsup.com/form/
[aplusl]: http://aplusldesign.com/
