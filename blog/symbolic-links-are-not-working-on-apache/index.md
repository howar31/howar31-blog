---
title: "Symbolic Links Are Not Working on Apache"
date: "2013-06-29"
---

# Symbolic Links Are Not Working on Apache

Due to some cases, I wanna do [CSS Injection](https://chrome.google.com/webstore/detail/css-inject/fmiohbdblcemacakpnoinjmcelddpjbg) with symbolic links to make coding easier. But I got errors (/var/log/apache/err\_log) which said `Symbolic link not allowed or link target not accessible`.

And finally I found [a solution](http://stackoverflow.com/questions/7102544/symbolic-link-not-allowed-or-link-target-not-accessible-on-fresh-installed-xam) works fine.

Generally speaking, because Apache default running as `www-data` or `_www` or somewhat whatever, it won't have the permission to access the symbolic links. To solve this problem, simply **set the user as yourself** and **restart Apache**, let Apache run as your identity!

> Written with [StackEdit](http://benweet.github.io/stackedit/).
