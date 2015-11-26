---
layout: post
title:  "Global Search Prototype v1.0"
date:   2013-08-02 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
---

These past days I've been busy trying to come up with a working product with the features that I'd earlier planned to include in this version of Global Search.
Finally, I feel happy to complete this milestone. Both my mentors Tomasz and Aparup have guided me well in this project clearing my doubts every now and then. You may try it out [here][gs-demo-link].

Feel free to clone my [Moodle gs2 branch][moodle-gs2-branch] and try out the product. I need deveopers to try it out and test it for any security leaks. The wiki has been updated with the complete [procedure for setting up Global Search][wiki]. Feel free to contact me with your feedback and comments.

I'm including screenshots of some advance search queries. This example here, indexes two pages and one pdf file generated from the [Superman wikipedia page][superman-wikipedia]. It takes into account Moodle's Wiki module.
The first screenshot shows a normal search for <code>superman</code> return <code>3</code> results.
![global-search-prototype-v1-0-gs_1]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_1.png)

The second screenshot shows a wildcard search for <code>super*</code>. Clearly, it matches different sets of keywords starting with <code>super</code>.
![global-search-prototype-v1-0-gs_2]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_2.png)

The third screenshot shows an example of proximity search for <code>"superman dc"~10</code>. This means that results will be shown wherever the two words are encountered within less than <code>10</code> words on either ends.
![global-search-prototype-v1-0-gs_3]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_3.png)

The remaining screenshots show boolean searches. You can clearly figure out the differences between them.
![global-search-prototype-v1-0-gs_4]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_4.png)
![global-search-prototype-v1-0-gs_5]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_5.png)
![global-search-prototype-v1-0-gs_6]({{ site.url }}/assets/images/global-search-prototype-v1-0-gs_6.png)

My next work will be to design a search UI page. Suggestions are welcome. You may directly contact me or post on [Moodle's developer forum post][dev-discussion].

[gs-demo-link]: https://github.com/prateeksachan/moodle/tree/gs2
[moodle-gs2-branch]: https://github.com/prateeksachan/moodle/tree/gs2
[wiki]: http://docs.moodle.org/dev/Global_search#Prototype:_version_1.0
[superman-wikipedia]: https://en.wikipedia.org/wiki/Superman
[dev-discussion]: https://moodle.org/mod/forum/discuss.php?d=227805
