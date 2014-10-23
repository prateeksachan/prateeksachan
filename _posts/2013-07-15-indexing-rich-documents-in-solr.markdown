---
layout: post
title:  "Indexing Rich Documents in Solr"
date:   2013-07-15 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
- tika
---

This week I integrated Apache Tika into Moodle to support indexing of Rich Documents like <code>.PDF</code>, <code>.DOC</code>, <code>.PPT</code> etc. Solr's [ExtractingRequestHandler][extracting-request-handler] uses Tika allowing users to upload binary files to Solr and have Solr extract text from it and then index it, making them searchable.

One has to send the file to Solr via <code>HTTP POST</code>. The following <code>cURL</code> request does the work:

<code>curl "http://localhost:8983/solr/update/extract?literal.id=1&commit=true" -F "myfile=@ps.pdf"</code>

- <code>ps.pdf</code> file is sent to Solr to extract content from it.
- <code>literal.id=1</code>: assigns the <code>id=1</code> to the Solr Document thus created.
- <code>commit=true</code>: Commits the changes to the solr index.
- <code>myfile=@ps.pdf</code>: This needs to be a valid relative or absolute path.

Refer the [wiki][extracting-request-handler] for more options on <code>ExtractingRequestHandler</code>

Now, using the <code>PECL PHP SOLR</code> client in Moodle, there isn't a way to get the extracted content and add it to solr document's field. The <code>cURL</code> request creates an all-new Solr Document specifically for the files and adds content to that Solr Document's fields.
Also, the <code>get_content_file_location()</code> function of Moodle that stores the absolute filepath of files is protected. 

So, keeping the above things in mind I had to come up with the following logic for including the feature of indexing Rich Documents via <code>ExtractingRequestHandler</code> in Global Search.
![indexing-rich-documents-in-solr]({{ site.url }}/assets/images/indexing-rich-documents-in-solr_1.png)

The access rights will be checked by extracting the <code>$id</code> of the Solr Document and passing it to the forum's access check function. [Full code][code-link].

And, here's the code that I've written for the Forum Module.
{% highlight php startinline %}
$url = search_curl_url(); // returns SOLR_SERVER_HOSTNAME . ':' . SOLR_SERVER_PORT . '/solr/update/extract?'
$url .= 'literal.id=' . 'forum_file_' . $id . '&literal.module=forum&literal.type=3&literal.courseid=' . $post->course;
$params = array();
$params[$id] = $file; // adds the $file stdClass object into $params array
$curl->post($url, $params); // sets CURLOPT_POST = 1
                            // sets CURLOPT_POSTFIELDS = array ($id => '@' . $filepath) via add_to_curl_request
                            // finally posts this curl request
{% endhighlight %}

The above code sends the external files to Solr for extracting content and creating new Solr Documents. I'm not committing the Documents after each <code>cURL</code> request as it would take a lot of time. Hence, after all the documents have been added, I'm execute <code>$client->commit</code> at the end.

[extracting-request-handler]: http://wiki.apache.org/solr/ExtractingRequestHandler
[code-link]: https://github.com/prateeksachan/moodle/blob/gs2/mod/forum/lib.php#L8572