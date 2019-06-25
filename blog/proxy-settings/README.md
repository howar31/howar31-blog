---
title: Proxy Settings Note
date: 2019-04-21
description: Note for proxy settings in so many different systems and tools
categories:
  - Dev Notes
tags:
  - proxy
  - snippet
---

# Proxy Settings Note

There are so many different system or tool configs to set if you are behind a proxy.  This article simple note where and how to set them.

I will use these settings for the following example:

* Proxy Host: 192.168.1.1
* Proxy Port: 3128

## Ubuntu

Config path: `/etc/environment`

```ini
http_proxy=http://192.168.1.1:3128
http_proxy_request_fulluri=1
https_proxy=http://192.168.1.1:3128
https_proxy_request_fulluri=0
no_proxy=localhost,127.0.0.1,localaddress,.localdomain.com

HTTP_PROXY=http://192.168.1.1:3128
HTTP_PROXY_REQUEST_FULLURI=1
HTTPS_PROXY=http://192.168.1.1:3128
HTTPS_PROXY_REQUEST_FULLURI=0
NO_PROXY=localhost,127.0.0.1,localaddress,.localdomain.com
```

## NPM

Config path: `~/.npmrc`

```ini
proxy=http://192.168.1.1:3128/
https-proxy=http://192.168.1.1:3128/
strict-ssl=false
registry=http://registry.npmjs.org/
```

## apt-get

Config path: `/etc/apt/apt.conf.d/95proxies`

```ini
Acquire::http::proxy "http://192.168.1.1:3128";
Acquire::ftp::proxy "ftp://192.168.1.1:3128";
Acquire::https::proxy "http://192.168.1.1:3128";
```