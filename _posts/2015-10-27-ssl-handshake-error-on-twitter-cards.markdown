---
layout: post
title:  "SSL Handshake error on Twitter Cards"
date:   2015-10-27 19:12:00
categories: uncategorized
tags: 
- ssl
- security
- twitter
---

I came across an unusual issue while trying to share a URL to fetch a [Twitter Card][twitter-card].

{% highlight php %}
ERROR: Fetching the page failed because SSL handshake error.
{% endhighlight %}

The domain already had a comodo SSL Certificate. And it was working fine.
A quick check of the SSL certificate on [Qualys SSL Labs][quality-ssl-labs], showed that the domain's SSL certificate had a really low rating.

There were many issues that had to be incorporated to increase the certificate's rating from <code>C</code> to <code>A</code>.

Following are the changes I made to my server's certificate settings:


- Turn off SSLv2 and SSLv3:
<code>SSLProtocol all -SSLv3 -SSLv2</code>

- Modify Cipher suites:
<code>SSLHonorCipherOrder on</code>
<code>SSLCipherSuite "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS"</code>

The above changes need to be made in the <code>ssl.conf</code> file.

However, these changes might slow down your website and pose issues for Googlebot during indexing and Pagespeed insights as <code>curl</code> might fail to get the contents of your website.

Please refer thh [Mozilla wiki][mozilla-wiki] docs for other changes that need to be updated with regarding SSL security.


[twitter-card]: https://dev.twitter.com/cards/overview
[quality-ssl-labs]: https://www.ssllabs.com/ssltest
[mozilla-wiki]: https://wiki.mozilla.org/Security
