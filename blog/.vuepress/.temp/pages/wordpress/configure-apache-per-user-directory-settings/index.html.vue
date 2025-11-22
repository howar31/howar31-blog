<template><div><p>To enable Apache for per-user directory, there are some settings need to configure.</p>
<blockquote>
<p><em>What is per-user directory?</em></p>
<p>Apache server default directory for webpage files is at /var/www. All website files are put here. Per-user directory let different user have different website root directories under their own home directory.</p>
</blockquote>
<h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2>
<ul>
<li>Ubuntu 12.04 LTS</li>
<li>Ubuntu default LAMP stack</li>
<li>Assume all default Apache, PHP, MySQL(LAMP) are already working on Ubuntu. Open http://localhost/ in your browser to check if Apache is properly working.</li>
</ul>
<p>Now we just have to modify some configurations to enable per-user directory feature.</p>
<h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration"><span>Configuration</span></a></h2>
<ol>
<li>
<p>Enable ‘userdir’ module</p>
<ul>
<li><code v-pre>sudo a2enmod userdir</code></li>
</ul>
</li>
<li>
<p>Create public_html folders under each user home directory and assign proper permissions</p>
<ul>
<li><code v-pre>mkdir ~/public_html</code></li>
<li><code v-pre>chmod 755 ~/public_html</code></li>
</ul>
</li>
<li>
<p>Configure PHP</p>
<ul>
<li><code v-pre>sudo vim /etc/apache2/mods-available/php5.conf</code> edit PHP configuration file</li>
<li>comment(#) some lines in configuration files: <code v-pre>&lt;IfModule mod_userdir.c&gt; &lt;Directory /home/*/public_html&gt; php_admin_value engine Off &lt;/Directory&gt; &lt;/IfModule&gt;</code></li>
</ul>
</li>
<li>
<p>Restart Apache service</p>
<ul>
<li><code v-pre>sudo service apache2 restart</code></li>
</ul>
</li>
</ol>
<h2 id="finish" tabindex="-1"><a class="header-anchor" href="#finish"><span>Finish</span></a></h2>
<p>Now web address should be <code v-pre>http://localhost/~username/</code></p>
<h2 id="reference" tabindex="-1"><a class="header-anchor" href="#reference"><span>Reference</span></a></h2>
<ul>
<li><a href="http://infraadvisory.wordpress.com/2013/03/14/userdir-module-per-user-directory-for-apache/" target="_blank" rel="noopener noreferrer">http://infraadvisory.wordpress.com/2013/03/14/userdir-module-per-user-directory-for-apache/</a></li>
</ul>
</div></template>


