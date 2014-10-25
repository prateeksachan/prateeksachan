---
layout: post
title:  "Updating Solr Index in Global Search"
date:   2013-06-19 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
---
Previous week, I started coding the <code>admin</code> page for Global Search. Here are the three indexing configurations that I've planned to implement: 

- Adding new documents. (This will be written such that the indexing is resumed from a previous run).

- Deleting index.  

- Updating index for the updated records

For updating index pertaining to update/change in a record, <code>solr</code> gives us two options:

- Treat the "updated" record as a whole new <code>SolrDocument</code> and re-index the complete document.

- Perform a partial update by re-indexing only that field which was updated.

The first approach outlined above is pretty simple. The <code>iterator</code> will return a recordset having <code>timemodified</code> from a previous index run. And, those records will be accordingly re-indexed. [As implemented by my mentor Tomasz earlier. [See wiki][wiki].
{% highlight php startinline %}
function mod_get_search_iterator($from = 0) {
  global $DB;
  $sql = "SELECT id, modified FROM {mod_table} WHERE modified >= ? ORDER BY modified ASC";
  return $DB->get_recordset_sql($sql, array($from));
}
{% endhighlight %}

The second approach was [recently released][solr-pl] by Solr. It could be very useful where thousands of documents may have been updated at once, and the first approach consumes a lot of time.

Lets, take an example. Suppose, we have <code>1000</code> books in Moodle stored in <code>courseid : 1</code>. The teacher/admin imports all the books to another course, say <code>courseid : 2</code>. So re-indexing all the 1000 books might not be very useful here. All we need to do is update only <code>field: 'courseid'</code> of all the books.

Solr supports several modifiers that atomically update values of a document.

<code>set</code> – set or replace a particular value, or remove the value if null is specified as the new value
<code>add</code> – adds an additional value to a list
<code>inc</code> – increments a numeric value by a specific amount

However, there's no specific <code>PHP</code> approach of doing it but only <code>XML</code> and <code>JSON</code>.
Hence, I will have to use <code>SolrClient::request</code> function to send a raw <code>XML</code> update request to the solr server. Here is a sample code of doing it in PHP.
{% highlight php startinline %}
$s = '';
$s.= '<add>';
for ($id = 1; $id <=1000; $id++){
	$s.= '<doc>';
	$s.= '<field name="id">' . $id . '</field>';
	$s.= '<field name="courseid" update="set">2</field>';
	$s.= '</doc>';
}
$s.= '</add>';
{% endhighlight %}

Followed by the following commands:
{% highlight php %}
$client->request($s);
$client->commit();
$client->optimize();
{% endhighlight %}


One thing has to be kept in mind that the string above should be less than <code>2MB</code> as defined in <code>solrconfig.xml</code>:
<code>multipartUploadLimitInKB="2048000"</code>. Running the above code resulted in a string of <code>~80KB</code>, so we could easily use it for updating fileds in a large set of documents.

However, I've to discuss this second approach with my mentors which I will probably do this week on how to implement this in Global Search.

[wiki]: http://docs.moodle.org/dev/Global_Search#mod_get_search_iterator.28.24from.3D0.29
[solr-pl]: http://solr.pl/en/2012/07/09/solr-4-0-partial-documents-update/