---
layout: post
title:  "Handling security in Global Search"
date:   2013-06-16 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
---
Handling security issues will be an integral part of Global Search. Last thing we want is users getting access to prohibited records through search. It will be a huge blow to the project if users get access to documents that they are not premissible to view. For this, the solution will be to filter the results after receiving the XML format of the query response from the solr server.

Here, I will be using 3 cases for every search result:

- <code>SEARCH_ACCESS_GRANTED</code>

- <code>SEARCH_ACCESS_DENIED</code>

- <code>SEARCH_ACCESS_DELETED</code>

I will check for every result whether the user has access to view it or not. If the user doesn't have access to it <code>SEARCH_ACCESS_DENIED</code>, that particular result will not be shown to the user.
In the alternative case, if the user is found to have permission to view a particular result <code>SEARCH_ACCESS_GRANTED</code>, then that record will be further checked if it has been deleted or not.

- If it has been deleted <code>SEARCH_ACCESS_DELETED</code>, the index will be updated by deleting that document from the index using <code>deleteByQuery('id:'.$docid)</code>

- If the record still exists, the result is then displayed to the user.

We will be getting only 1000 results from the Solr response Object for a query <code>$query->setRows(1000)</code> and check for access. Once, we have <code>100</code> results to be shown to the user (having <code>SEARCH_ACCESS_GRANTED</code>), it will stop checking for permission and will terminate showing those <code>100</code> results.