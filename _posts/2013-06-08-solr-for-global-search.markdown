---
layout: post
title:  "Solr for Global Search"
date:   2013-06-08 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
- pecl
---
This week I got started integrating search into Moodle core [writing code][writing-code]  for search within Moodle's page module. I decided to quickly pick a module and test Solr with it. Things become easy when you actually do stuff and see it happening infront of you. This also gave me the advantage of laying down the search API structure. Thanks to my mentor Aparup on guiding me with it.

The idea is to use the [php-pecl-solr][php-pecl-solr] extension. It's faster as its build into PHP itself. Some major advantages:

- Its wholly written in C. Hence, its extremely fast. compared to other PHP solr client libraries.

- Object-oriented API that makes it easier and efficient for developers to communicate and interact with Apache Solr Server.

- Documented in PHP.

However, one has to have a dedicated server to install this extension. 

There were many doubts concerning the integration of such extension in Moodle. Implecations stating that the extension relies on server. Moodle sites installed on shared servers cannot use this search feature. Also, servers need to have Java hosting. However, my mentor Tomasz has previously tried implementing a search feature in Moodle and [informed][informed] that there are no search engines written in PHP (Moodle is based on PHP). I feel that as Moodle is majorly used by many colleges and universities across the world who have their own dedicated servers, so using the extension is a safe bet to some extent. *Something is always better than nothing*.

In the future, we will obviously make it flexible to avoid dependancy on server after seeing the success of this first version of Global Search.

The current official version of <code>php-pecl-solr</code> extension doesn't work with Solr4. There's a minute difference in the client constructor that makes it flexible to use for <code>Solr 3.x</code> or <code>Solr 4.x</code> 

{% highlight ruby linenos%}
<?php
$options = array( 'hostname' => 127.0.0.1 );
$client = new SolrClient($options, "4.0");
?>
{%endhighlight%}

However, [patch][solr-patch] is available that will be merged into the offical stable release in the future.

I'm maintaining a complete procedure for installing this extension on [Moodle docs][moodle-docs].

Feel free to go through/or drop in the discussion [here][global-search-forum].

[writing-code]: https://github.com/prateeksachan/moodle/tree/gs2/search
[php-pecl-solr]: http://www.php.net/manual/en/book.solr.php
[informed]: https://moodle.org/mod/forum/discuss.php?d=227805#p999690
[solr-patch]: https://github.com/lukaszkujawa/php-pecl-solr
[moodle-docs]: http://docs.moodle.org/dev/Global_search
[global-search-forum]: https://moodle.org/mod/forum/discuss.php?d=227805