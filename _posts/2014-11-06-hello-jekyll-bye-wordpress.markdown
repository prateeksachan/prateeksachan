---
layout: post
title:  "Hello Jekyll. Bye Wordpress"
date:   2014-11-06 15:12:00
categories: uncategorized
tags: 
- jekyll
---
For some time, I was looking out for a simplistic blogging platform. After spending time with [Wordpress][wordpress], I thought I wasn't doing much justice to it. My personal site contains just HTML posts, so writing them in plain markdown would be preferable compared to heavy WYSIWYG platforms. I don't need to take care about the back-end much and get complete control over the front-end.

That's where Jekyll comes in giving you complete control over the generation of HTML content. Previously, I'd been under the limitations of a shared hosting provider. Moving my hosting to a dedicated VPS was painless and something I'd wanted to do for a long long time.

It look me some time to figure out the Jekyll mechanism. Once done, writing posts is almost effortless. One copy of my repo is on [Github][github-repo] with another copy generating the HTML content kept in my VM on every commit I push. There are many blogs which would eventually be helpful in writing a fully-fledged Jekyll website.

I've set up a post-receive hook in my VPS that updates the site on every git commit.

{% highlight php %}
#!/bin/bash -l
GIT_REPO=$HOME/repos/myblog.git
TMP_GIT_CLONE=$HOME/tmp/git/myblog
PUBLIC_WWW=/var/www/myblog

git clone $GIT_REPO $TMP_GIT_CLONE
jekyll build --source $TMP_GIT_CLONE --destination $PUBLIC_WWW
rm -Rf $TMP_GIT_CLONE
exit
{% endhighlight %}

This [intagram-jekyll][instagram-jeykll] script helped me setting up my instagram feed.

You could also refer to the [Liquid cheatsheet provided by Shopify][liquid-cheatsheet].

[wordpress]: https://wordpress.org/
[github-repo]: https://github.com/prateeksachan/prateeksachan
[instagram-jeykll]: https://github.com/mthomas/instagram-jekyll/blob/master/instagram-jekyll.rb
[liquid-cheatsheet]: https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
