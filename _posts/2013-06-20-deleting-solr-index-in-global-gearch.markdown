---
layout: post
title:  "Deleting Solr Index in Global Search"
date:   2013-06-20 15:12:00
categories: gsoc-2013
tags: 
- moodle
- solr
---

I implemented the functionality of allowing the <code>admin</code> to delete solr index recently. The code can be seen [here][code-link].

Solr provides a simple way of deleting indexing using <code>SolrClient::deleteByQuery</code>. I have provided two types of deleting index:

- Deleting the complete index in one-go.

- Deleteing index modularily. (For example, deleting index for records belonging to <code>book</code> and <code>page</code> modules only)

The idea was to make the <code>admin</code> select the delete option: <code>All</code> or let the <code>admin</code> choose the modules. I made these options available to the <code>admin</code> through Moodle Quick Forms. Here is a code snippet:

{% highlight php startinline%}
class search_admin_form extends moodleform {
 
  function definition() {
 
    	$mform = & $this->_form;
    	....
	....
	$modcheckboxarray = array();
	$modcheckboxarray[] =& $mform->createElement('advcheckbox', 'all', '', 'All Modules', array('group' => 1));
	$modcheckboxarray[] =& $mform->createElement('advcheckbox', 'book', '', 'Book', array('group' => 2));
	$modcheckboxarray[] =& $mform->createElement('advcheckbox', 'page', '', 'Page', array('group' => 2));
	$mform->addGroup($modcheckboxarray, 'modadvcheckbox', '', array(' '), false);
	$mform->closeHeaderBefore('modadvcheckbox');
	....
	....
  }
}
 
$mform = new search_admin_form();
 
if ($data = $mform->get_data()) {
  //do stuff here
  //and call search_delete_index() function
 
}
{% endhighlight %}

If the <code>admin</code> chooses <code>checkbox: all</code> the <code>$client->deleteByQuery('*:*')</code> is executed, deleting the entire solr index.
If, on the other hand the <code>admin</code> chooses only some modules to delete their index, the name of the modules are concatenated together separated by a string, stored as a <code>stdClass $data->module</code> and passed as a parameter into the <code>search_delete_index</code> function, thus executing <code>$client->deleteByQuery('modules:' .$data)</code>

That for the first part: deletion.
After deletion, I need to handle the the config settings, so that the <code>admin</code> is able to re-index. This is done by re-setting the values in the <code>config_plugin</code> table. This is done through the below simple code:
{% highlight php %}
foreach ($mods as $key => $name) {
        set_config($name . '_indexingstart', 0, 'search');
        set_config($name . '_indexingend', 0, 'search');
        set_config($name . '_lastindexrun', 0, 'search');
        set_config($name . '_docsignored', 0, 'search');
        set_config($name . '_docsprocessed', 0, 'search');
        set_config($name . '_recordsprocessed', 0, 'search');
}
{% endhighlight %}

Here, <code>$mods</code> will be a simple array containing the names of all modules or only those modules whose index was selected for deletion.

[code-link]: https://github.com/prateeksachan/moodle/blob/gs2/search/lib.php#L170"