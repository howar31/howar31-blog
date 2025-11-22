<template><div><h1 id="linux-session-manager-screen" tabindex="-1"><a class="header-anchor" href="#linux-session-manager-screen"><span>Linux Session Manager - Screen</span></a></h1>
<p><strong>screen</strong> 是在Linux上用來做window或session管理的指令，可以用單一實體terminal模擬多個sessions同時多工執行</p>
<h2 id="常用指令" tabindex="-1"><a class="header-anchor" href="#常用指令"><span>常用指令</span></a></h2>
<ul>
<li><code v-pre>screen -dmS &lt;session_name&gt;</code>
<ul>
<li><code v-pre>-dm</code> 啟用screen並指定起始狀態為detach mode，會建立一個新的session但不會attach，特別適合用於system startup script</li>
<li><code v-pre>-S</code> 指定session名稱</li>
</ul>
</li>
<li><code v-pre>screen -r &lt;pid_tty_host&gt;</code>
<ul>
<li><code v-pre>-r</code> reattach一個session</li>
<li><code v-pre>-R</code> reattach一個session，若session不存在則先建立session</li>
</ul>
</li>
<li><code v-pre>screen -d &lt;pid_tty_host&gt;</code>
<ul>
<li><code v-pre>-d</code> detatch一個已經在遠端attach的session，當session已經在別的地方attach時，必須先detach才能reattach</li>
<li><code v-pre>-D</code> detatch並logout一個遠端的session</li>
</ul>
</li>
<li><code v-pre>screen -DR &lt;pid_tty_host&gt;</code>
<ul>
<li>如果session存在，則reattach</li>
<li>如果session在遠端已經attach，則detatch並logout</li>
<li>如果session不存在，則建立新的session</li>
</ul>
</li>
<li><code v-pre>screen -ls</code>
<ul>
<li>列出目前所有screen的pid.tty.host</li>
</ul>
</li>
</ul>
<h2 id="組合按鍵" tabindex="-1"><a class="header-anchor" href="#組合按鍵"><span>組合按鍵</span></a></h2>
<p>已經在screen中，使用組合按鍵操作screen，所有screen的組合按鍵都由<code v-pre>Ctrl+A</code>開始(後記為<code v-pre>C-a</code>)，為了操作方便，所有<strong>小寫</strong>的快速鍵，加上<code v-pre>Ctrl</code>一樣可以運作，例如，<code v-pre>C-a c</code>等同於<code v-pre>C-a C-c</code></p>
<ul>
<li>資訊
<ul>
<li><code v-pre>C-a ?</code> 顯示快速鍵幫助</li>
<li><code v-pre>C-a &quot;</code> 列出所有window列表</li>
<li><code v-pre>C-a w</code> 顯示window簡單列表</li>
<li><code v-pre>C-a *</code> 顯示session attach資訊列表</li>
<li><code v-pre>C-a i</code> 顯示目前window資訊</li>
</ul>
</li>
<li>切換window
<ul>
<li><code v-pre>C-a '</code> 輸入數字或window name跳轉window</li>
<li><code v-pre>C-a [0~9]</code> 直接跳轉到0~9的window</li>
<li><code v-pre>C-a C-a</code> 切換到上一個window</li>
</ul>
</li>
<li>Window操作
<ul>
<li><code v-pre>C-a c</code> 建立新的window</li>
<li><code v-pre>C-a d</code> detatch目前的screen</li>
<li><code v-pre>C-a k</code> 銷毀目前window</li>
<li><code v-pre>C-a space</code>或<code v-pre>C-a n</code> 切換到下一個window</li>
</ul>
</li>
<li>分割視窗
<ul>
<li><code v-pre>C-a S</code> 水平分割window</li>
<li><code v-pre>C-a |</code> 垂直分割window</li>
<li><code v-pre>C-a tab</code> 在分割之間切換focus</li>
<li><code v-pre>C-a X</code> 關閉目前分割</li>
<li><code v-pre>C-a Q</code> 關閉所有分割，但保留目前使用的</li>
</ul>
</li>
<li>其他
<ul>
<li><code v-pre>C-a C-g</code> 切換visual bell模式，用螢幕閃爍或喇叭聲響表示bell</li>
<li><code v-pre>C-a x</code> 鎖住terminal</li>
<li><code v-pre>C-a :</code> 進入command line模式</li>
</ul>
</li>
</ul>
<h2 id="command-line" tabindex="-1"><a class="header-anchor" href="#command-line"><span>Command Line</span></a></h2>
<p>使用<code v-pre>C-a :</code>進入command line模式，可以進行進階設定</p>
<ul>
<li><code v-pre>encoding [enc]</code> 設定screen如何編碼input/output
<ul>
<li>[enc]: eucJP, SJIS, eucKR, eucCN, Big5, GBK, KOI8-R, CP1251, UTF-8, ISO8859-2, ISO8859-3, ISO8859-4, ISO8859-5, ISO8859-6, ISO8859-7, ISO8859-8, ISO8859-9, ISO8859-10, ISO8859-15, jis.</li>
</ul>
</li>
<li><code v-pre>title [windowtitle]</code> 設定目前window的title為[windowtitle]</li>
</ul>
<h2 id="其他" tabindex="-1"><a class="header-anchor" href="#其他"><span>其他</span></a></h2>
<p>更多screen操作方式請見<code v-pre>man screen</code></p>
<blockquote>
<p>Written with <a href="https://stackedit.io/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


