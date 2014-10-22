---
layout: post
title:  "Indexing Rich Documents in Solr"
date:   2013-07-15 15:12:00
categories: gsoc-2013
tags: moodle solr tika
---

This week I integrated Apache Tika into Moodle to support indexing of Rich Documents like <code>.PDF</code>, <code>.DOC</code>, <code>.PPT</code> etc. Solr's [ExtractingRequestHandler][extracting-request-handler] uses Tika allowing users to upload binary files to Solr and have Solr extract text from it and then index it, making them searchable.

One has to send the file to Solr via <code>HTTP POST</code>. The following <code>cURL</code> request does the work:

- <code>curl "http://localhost:8983/solr/update/extract?literal.id=1&commit=true" -F "myfile=@ps.pdf"</code>
- <code>ps.pdf</code> file is sent to Solr to extract content from it.
- <code>literal.id=1</code>: assigns the <code>id=1</code> to the Solr Document thus created.
- <code>commit=true</code>: Commits the changes to the solr index.
- <code>myfile=@ps.pdf</code>: This needs to be a valid relative or absolute path.

Refer the [wiki][extracting-request-handler] for more options on <code>ExtractingRequestHandler</code>

Now, using the <code>PECL PHP SOLR</code> client in Moodle, there isn't a way to get the extracted content and add it to solr document's field. The <code>cURL</code> request creates an all-new Solr Document specifically for the files and adds content to that Solr Document's fields.
Also, the <code>get_content_file_location()</code> function of Moodle that stores the absolute filepath of files is protected. But, there is a predefined <code>add_to_curl_request()</code> <a href="https://github.com/moodle/moodle/blob/master/lib/filestorage/stored_file.php#L379" target="_new">function</a> that adds a file to the <code>cURL</code> request.
<code>$curlrequest->_tmp_file_post_params[$key] = '@' . $this->get_content_file_location()</code>
So, keeping all these things in mind I had to come up with the following logic for including the feature of indexing Rich Documents via <code>ExtractingRequestHandler</code> in Global Search.
<img src="images/1.png">

The access rights will be checked by extracting the <code>$id</code> of the Solr Document and passing it to the forum's access check function.<a href="https://github.com/prateeksachan/moodle/blob/gs2/mod/forum/lib.php#L8572" target="_new">[Full code]</a>
And, here's the code that I've written for the Forum Module.
<script src="https://gist.github.com/prateeksachan/6004036.js"></script>
The above code sends the external files to Solr for extracting content and creating new Solr Documents. I'm not committing the Documents after each <code>cURL</code> request as it would take a lot of time. Hence, after all the documents have been added, I'm execute <code>$client->commit</code> at the end.

[extracting-request-handler]: http://wiki.apache.org/solr/ExtractingRequestHandler