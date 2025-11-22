<template><div><h1 id="symbolic-links-are-not-working-on-apache" tabindex="-1"><a class="header-anchor" href="#symbolic-links-are-not-working-on-apache"><span>Symbolic Links Are Not Working on Apache</span></a></h1>
<p>Due to some cases, I wanna do <a href="https://chrome.google.com/webstore/detail/css-inject/fmiohbdblcemacakpnoinjmcelddpjbg" target="_blank" rel="noopener noreferrer">CSS Injection</a> with symbolic links to make coding easier. But I got errors (/var/log/apache/err_log) which said <code v-pre>Symbolic link not allowed or link target not accessible</code>.</p>
<p>And finally I found <a href="http://stackoverflow.com/questions/7102544/symbolic-link-not-allowed-or-link-target-not-accessible-on-fresh-installed-xam" target="_blank" rel="noopener noreferrer">a solution</a> works fine.</p>
<p>Generally speaking, because Apache default running as <code v-pre>www-data</code> or <code v-pre>_www</code> or somewhat whatever, it won't have the permission to access the symbolic links. To solve this problem, simply <strong>set the user as yourself</strong> and <strong>restart Apache</strong>, let Apache run as your identity!</p>
<blockquote>
<p>Written with <a href="http://benweet.github.io/stackedit/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


