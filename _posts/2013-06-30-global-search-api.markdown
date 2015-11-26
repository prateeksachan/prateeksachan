---
layout: post
title:  "Global Search API"
date:   2013-06-30 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
---

This week I started off starting the Search API functions for Global Search. The idea is to code 3 functions for each module. These will be written in the module's <code>lib.php</code> file.

- <code>_get_iterator($from=0)</code>
- <code>_search_get_documents($id)</code>
- <code>_search_access($id)</code>

The former two functions are used while indexing records while the last one is used to check user permissions for displaying the search results.
The admin has the option to enable a particular module/resource for supporting Global Search through settings. You may view the [code here][code-link].

The first function <code>_get_iterator($from=0)</code> will return a recordset. I've already covered it in [Updating Solr Index in Global Search][post-link-1].

The second function <code>_search_get_documents($id)</code> creates a <code>SolrInputDocument</code> by including data from the database by specifying fields. An example is shown below:

{% highlight php startinline %}
//get a chapter's records for each chapter id
$chapter = $DB->get_record('book_chapters', array('id' => $id), '*', MUST_EXIST);
 
//get book record for that chapter
$book = $DB->get_record('book', array('id' => $chapter->bookid), '*', MUST_EXIST);
 
$doc = new SolrInputDocument();
$doc->addField('id', 'book_' . $chapter->id);
$doc->addField('name', $book->name);
$doc->addField('intro', format_text($book->intro, $book->introformat, array('nocache' => true, 'para' => false)));
$doc->addField('title', $chapter->title);
$doc->addField('content', format_text($chapter->content, $chapter->contentformat, array('nocache' => true, 'para' => false)));
$doc->addField('contextlink', '/mod/book/view.php?id=' . $cm->id .'&chapterid=' . $book->id);
$doc->addField('module', 'book');
{% endhighlight %}

The tricky part is to correctly structure our indexed records. For example, for the <code>book</code> module, <code>_get_iterator()</code> will return the record of a particular chapter. Hence, each chapter will be a separate <code>SolrInputDocument</code> having solr field <code>id->chapterid</code>.
The third function maintains security by checking Moodle caps and restricting access to prohibited search results. I've already discussed about Global Search security in [Handling security in Global Search][post-link-2].

[code-link]: https://github.com/prateeksachan/moodle/tree/gs2/admin/settings/globalsearch.php
[post-link-1]: http://prateeksachan.com/updating-solr-index-in-global-search/
[post-link-2]: http://prateeksachan.com/handling-security-in-global-search/
