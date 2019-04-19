---
title: "Configure Apache per-user Directory Settings"
date: "2013-07-18"
---

To enable Apache for per-user directory, there are some settings need to configure.

> _What is per-user directory?_
> 
> Apache server default directory for webpage files is at /var/www. All website files are put here. Per-user directory let different user have different website root directories under their own home directory.

## Environment

- Ubuntu 12.04 LTS
- Ubuntu default LAMP stack
- Assume all default Apache, PHP, MySQL(LAMP) are already working on Ubuntu. Open http://localhost/ in your browser to check if Apache is properly working.

Now we just have to modify some configurations to enable per-user directory feature.

## Configuration

1. Enable ‘userdir’ module
    
    - `sudo a2enmod userdir`
2. Create public\_html folders under each user home directory and assign proper permissions
    
    - `mkdir ~/public_html`
    - `chmod 755 ~/public_html`
3. Configure PHP
    
    - `sudo vim /etc/apache2/mods-available/php5.conf` edit PHP configuration file
    - comment(#) some lines in configuration files: `<IfModule mod_userdir.c> <Directory /home/*/public_html> php_admin_value engine Off </Directory> </IfModule>`
4. Restart Apache service
    
    - `sudo service apache2 restart`

## Finish

Now web address should be `http://localhost/~username/`

## Reference

- <http://infraadvisory.wordpress.com/2013/03/14/userdir-module-per-user-directory-for-apache/>
