---
layout: post
title:  "Elasticsearch module for Drupal 8"
date:   2014-08-18 15:12:00
categories: gsoc-2014
tags: 
- drupal
- elasticsearch
---
This post finally marks the completion of a workable Elasticsearch module for [Drupal][drupal] 8. The [docs][project-page] has been updated. I've also uploaded a [video][youtube-video-link] to help users with the installation of this module.

A big thanks goes to my two mentors: [Nick][Nick_vh] and [Thomas][drunken-monkey]. A LOT of credit goes out to them for this project. I'm also thankful to [chx][chx] and the entire Drupal community. 

On the whole, it was an awesome project with immense learing experience for me, regarding both [Elasticsearch][elasticsearch] and the new Drupla 8.

The module currently works for the latest Drupal 8.0.x with [Search API sandbox][search-api] and uses the official Elasticsearch-php library. I've also included a set of Search API test cases.

**EDIT**

The project was successfully merged in the [Elasticsearch Connector 8.x branch][elasticsearch-connector-8x-branch] which will be its new home. I'll keep updating the module on both project sandboxes with the changes reflected in Drupal 8 and Search API.


[drupal]: https://moodle.org/
[elasticsearch]: http://www.elasticsearch.org/
[search-api]: https://www.drupal.org/sandbox/daeron/2091893
[project-page]: https://www.drupal.org/sandbox/prateeksachan/2275583
[youtube-video-link]: http://youtu.be/bX0PnhnQWoc
[Nick_vh]: https://www.drupal.org/u/Nick_vh
[drunken-monkey]: https://www.drupal.org/u/drunken-monkey
[chx]: https://www.drupal.org/u/chx
[elasticsearch-connector-8x-branch]: https://www.drupal.org/node/2159059/git-instructions/8.x-1.x
