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

::: tip Edit - 2019.09.10

- Add [Git](#git) section.
- Fix typo

:::

There are so many different system or tool configs to set if you are behind a proxy.  This article simply note where and how to set them.

I will use these settings for the following example:

- Proxy Host: host
- Proxy Port: 3128
- Proxy User: username
- Proxy Password: password

::: warning
You need to **URL encode** your username or password if special characters contains.  
i.g. *whitespace* = `%20`, *&* = `%26`, etc...
:::

## Ubuntu

Config file path: `/etc/environment`

```sh
http_proxy="http://username:password@host:3128"
http_proxy_request_fulluri=1
https_proxy="http://username:password@host:3128"
https_proxy_request_fulluri=0
no_proxy="localhost, 127.0.*, 192.168.*, 10.*, *.local"

HTTP_PROXY="http://username:password@host:3128"
HTTP_PROXY_REQUEST_FULLURI=1
HTTPS_PROXY="http://username:password@host:3128"
HTTPS_PROXY_REQUEST_FULLURI=0
NO_PROXY="localhost, 127.0.*, 192.168.*, 10.*, *.local"
```

## apt-get

Config file path: `/etc/apt/apt.conf.d/95proxies`

```sh
Acquire::http::proxy "http://username:password@host:3128";
Acquire::https::proxy "http://username:password@host:3128";
Acquire::ftp::proxy "ftp://username:password@host:3128";
```

## NPM

Config file path: `~/.npmrc`

```sh
proxy=http://username:password@host:3128/
https-proxy=http://username:password@host:3128/
strict-ssl=false
registry=http://registry.npmjs.org/
```

## Git

```sh
git config --global http.proxy http://username:password@host:3128
```
