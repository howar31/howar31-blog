<template><div><h2 id="ssi-on-ubuntu" tabindex="-1"><a class="header-anchor" href="#ssi-on-ubuntu"><span>SSI on Ubuntu</span></a></h2>
<p>To enable SSI on <strong>Debian</strong> Distribution (Ubuntu) is easy:</p>
<p><code v-pre>a2enmod include</code></p>
<h2 id="ssi-on-mac-os-x" tabindex="-1"><a class="header-anchor" href="#ssi-on-mac-os-x"><span>SSI on Mac OS X</span></a></h2>
<p>Mac OS X has no such command so that we have to manually modify the configuration files.</p>
<p>There are 2 ways to achieve this:</p>
<ol>
<li>
<p>Global Configuration</p>
<ul>
<li>edit <code v-pre>/etc/apache2/httpd.conf</code></li>
<li>Uncomment <code v-pre>AddType text/html .shtml AddOutputFilter INCLUDES .shtml</code></li>
</ul>
</li>
<li>
<p>Per-User Configuration</p>
<ul>
<li>edit <code v-pre>/etc/apache2/users/username.conf</code></li>
<li><code v-pre>&lt;Directory &quot;/Users/username/Sites/&quot;&gt; Options Indexes MultiViews Includes AllowOverride All Order allow,deny Allow from all AddType text/html .shtml AddOutputFilter INCLUDES .shtml &lt;/Directory&gt;</code></li>
</ul>
</li>
</ol>
<p>Then restart apache and all done. <code v-pre>sudo apachectl restart</code></p>
<h2 id="reference" tabindex="-1"><a class="header-anchor" href="#reference"><span>Reference</span></a></h2>
<ol>
<li><a href="http://www.456bereastreet.com/archive/201104/apache_with_virtual_hosts_php_and_ssi_on_mac_os_x_106/" target="_blank" rel="noopener noreferrer">Apache with virtual hosts, PHP and SSI on Mac OS X 10.6</a></li>
</ol>
</div></template>


