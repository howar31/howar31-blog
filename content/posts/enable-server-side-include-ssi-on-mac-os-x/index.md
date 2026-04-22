---
title: "Enable Server Side Include (SSI) on Mac OS X"
date: "2013-08-05"
categories:
  - wordpress
---

## SSI on Ubuntu

To enable SSI on **Debian** Distribution (Ubuntu) is easy:

`a2enmod include`

## SSI on Mac OS X

Mac OS X has no such command so that we have to manually modify the configuration files.

There are 2 ways to achieve this:

1. Global Configuration
    
    - edit `/etc/apache2/httpd.conf`
    - Uncomment `AddType text/html .shtml AddOutputFilter INCLUDES .shtml`
2. Per-User Configuration
    
    - edit `/etc/apache2/users/username.conf`
    - `<Directory "/Users/username/Sites/"> Options Indexes MultiViews Includes AllowOverride All Order allow,deny Allow from all AddType text/html .shtml AddOutputFilter INCLUDES .shtml </Directory>`

Then restart apache and all done. `sudo apachectl restart`

## Reference

1. [Apache with virtual hosts, PHP and SSI on Mac OS X 10.6](http://www.456bereastreet.com/archive/201104/apache_with_virtual_hosts_php_and_ssi_on_mac_os_x_106/)
