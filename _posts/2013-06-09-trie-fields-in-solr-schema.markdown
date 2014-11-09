---
layout: post
title:  "Trie fields in Solr Schema"
date:   2013-06-09 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
- trie
---
Well this particular post is dedicated to Data Structures. It will be the first time I would be implementing <code>Trie</code> in real-life situations (apart from the college assignments), hence I thought that a post was in immediate order.

When integrating Apache Solr search engine, one of the most important files is <code>schema.xml</code>. A lot of effectiveness and optimization of the search depends upon it. The file contains details about the different fields of our documents that will be indexed, and the manner in which the indexing will take place.

So, lets talk about <code>Trie</code> for a while. Suppose we have five words:
{% highlight php %}
tall
tea
tee
tim
tom
{% endhighlight %}

The above five words could be implemented in the following manner:
{% highlight php %}
t--a--l--l
|
|--e--a
|  |
|  \--e
|
|--i--m
|
\--o--m
{% endhighlight %}

Now, Solr uses this structure to index documents. Following is the declaration of <code>Trie</code> field types in <code>schema.xml</code>.

{% highlight ruby linenos %}
<fieldType name="tint" class="solr.TrieIntField" precisionStep="8" positionIncrementGap="0"/>
<fieldType name="tfloat" class="solr.TrieFloatField" precisionStep="8" positionIncrementGap="0"/>
<fieldType name="tlong" class="solr.TrieLongField" precisionStep="8" positionIncrementGap="0"/>
<fieldType name="tdouble" class="solr.TrieDoubleField" precisionStep="8" positionIncrementGap="0"/>
{% endhighlight %}

Suppose, I want to index the integer <code>4208909997</code>. When Solr indexes this integer it saves the <code>hex</code> equivalents at different precision levels.
(<code>FADEDEAD</code> = <code>4208909997</code> in <code>hex</code>) 

A <code>precisionStep="12"</code> would result in:
{% highlight ruby linenos %}
FA000000
FADED000
FADEDEAD
{% endhighlight %}

A <code>precisionStep="8"</code> would result in:
{% highlight ruby linenos %}
FA000000
FADE0000
FADEDE00
FADEDEAD
{% endhighlight %}

A <code>precisionStep="8"</code> would result in:
{% highlight ruby linenos %}
F0000000
FA000000
FAD00000
FADE0000
FADED000
FADEDE00
FADEDEA0
FADEDEAD
{% endhighlight %}

Now, if solr has to search for <code>FADEDEAx</code> to <code>FADEDEAD</code>, using a precision step of <code>8</code> would result in going through all the <code>16</code> possibilities to find the record, but just one record in case of precision step of <code>4</code>. 

So clearly, a small precision step makes the query fast but also increases the index size. Hence, I will have to test different cases to come out with the "perfect" <code>schema</code> for solr.

Credits: [Mental Detritus: Grokking Solr Trie Fields](http://mentaldetritus.blogspot.in/2013/01/grokking-solr-trie-fields.html)
