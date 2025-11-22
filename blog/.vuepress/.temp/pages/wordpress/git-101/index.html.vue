<template><div><h1 id="git-101-基礎入門" tabindex="-1"><a class="header-anchor" href="#git-101-基礎入門"><span>Git 101 基礎入門</span></a></h1>
<h2 id="git起源" tabindex="-1"><a class="header-anchor" href="#git起源"><span>Git起源</span></a></h2>
<p>Git是一種著重於速度的<a href="http://en.wikipedia.org/wiki/Distributed_version_control" target="_blank" rel="noopener noreferrer">Version Control System</a>和<a href="http://en.wikipedia.org/wiki/Source_code_management" target="_blank" rel="noopener noreferrer">Source Code Management System</a>，最初是由<a href="http://en.wikipedia.org/wiki/Linus_Torvalds" target="_blank" rel="noopener noreferrer">Linux Torvalds</a>為了維護<a href="http://en.wikipedia.org/wiki/Linux_kernel" target="_blank" rel="noopener noreferrer">Linux Kernel</a>而在2005年創建的。</p>
<h2 id="git特色" tabindex="-1"><a class="header-anchor" href="#git特色"><span>Git特色</span></a></h2>
<p>Git基於維護<a href="http://en.wikipedia.org/wiki/Linux_kernel" target="_blank" rel="noopener noreferrer">Linux Kernel</a>這樣大型專案的需求與經驗，以及一些File System的概念而誕生，其著重的特色:</p>
<ol>
<li>Non-linear Development</li>
<li>Distributed Development</li>
<li>Compatibility with existing systems/protocols</li>
<li>Efficient handling of large projects</li>
<li>Cryptographic authentication of history</li>
<li>Toolkit-based design</li>
<li>Pluggable merge strategies</li>
<li>Garbage accumulates unless collected</li>
<li>Periodic explicit object packing</li>
</ol>
<h2 id="git基本指令" tabindex="-1"><a class="header-anchor" href="#git基本指令"><span>Git基本指令</span></a></h2>
<ul>
<li><code v-pre>git init</code>
<ul>
<li>起始一個git repository</li>
</ul>
</li>
<li><code v-pre>git status</code>
<ul>
<li>檢查git repository的目前(commit/push)狀態</li>
</ul>
</li>
<li><code v-pre>git add [檔案]</code>
<ul>
<li>新增commit檔案</li>
</ul>
</li>
<li><code v-pre>git rm [檔案]</code>
<ul>
<li>刪除commit檔案</li>
</ul>
</li>
<li><code v-pre>git commit -m “[commit註解]“</code>
<ul>
<li>commit檔案並附上註解</li>
</ul>
</li>
<li><code v-pre>git log</code>
<ul>
<li>查看commit歷史紀錄</li>
</ul>
</li>
<li><code v-pre>git remote add [repository名稱] [repository網址]</code>
<ul>
<li>新增remote repository</li>
</ul>
</li>
<li><code v-pre>git remote -v</code>
<ul>
<li>列出目前設定的remote</li>
</ul>
</li>
<li><code v-pre>git push -u [repository名稱] [branch名稱]</code>
<ul>
<li>推送檔案到remote repository上</li>
<li>-u 記住這次參數設定，下次只要git push即可</li>
</ul>
</li>
<li><code v-pre>git pull [repository名稱] [branch名稱]</code>
<ul>
<li>從remote repository上拉檔案下來</li>
</ul>
</li>
<li><code v-pre>git diff HEAD</code>
<ul>
<li>比較檔案差異，最新的commit指標為HEAD</li>
</ul>
</li>
<li><code v-pre>git checkout –[目標檔案]</code>
<ul>
<li>回復版本</li>
</ul>
</li>
<li><code v-pre>git branch [branch名稱]</code>
<ul>
<li>開新分支</li>
</ul>
</li>
<li><code v-pre>git branch -d [branch名稱]</code>
<ul>
<li>刪除分支</li>
</ul>
</li>
<li><code v-pre>git checkout [branch名稱]</code>
<ul>
<li>切換分支</li>
</ul>
</li>
<li><code v-pre>git merge [來源branch]</code>
<ul>
<li>合併分支</li>
</ul>
</li>
</ul>
<h2 id="git練習" tabindex="-1"><a class="header-anchor" href="#git練習"><span>Git練習</span></a></h2>
<p>這邊有互動式的線上模擬git練習，方便初學理解概念與操作方法</p>
<ul>
<li><a href="http://try.github.io/" target="_blank" rel="noopener noreferrer">http://try.github.io/</a></li>
<li><a href="http://pcottle.github.io/learnGitBranching/" target="_blank" rel="noopener noreferrer">http://pcottle.github.io/learnGitBranching/</a></li>
</ul>
<h2 id="參考資料" tabindex="-1"><a class="header-anchor" href="#參考資料"><span>參考資料</span></a></h2>
<ul>
<li><a href="http://git-scm.com/" target="_blank" rel="noopener noreferrer">http://git-scm.com/</a></li>
<li><a href="https://github.s3.amazonaws.com/media/progit.en.pdf" target="_blank" rel="noopener noreferrer">https://github.s3.amazonaws.com/media/progit.en.pdf</a></li>
<li><a href="http://en.wikipedia.org/wiki/Git_(software)" target="_blank" rel="noopener noreferrer">http://en.wikipedia.org/wiki/Git_(software)</a></li>
</ul>
<blockquote>
<p>本篇投影片網址 <a href="http://www.slideshare.net/howar31/git-101-25940669" target="_blank" rel="noopener noreferrer">http://www.slideshare.net/howar31/git-101-25940669</a></p>
<p>Written with <a href="http://benweet.github.io/stackedit/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


