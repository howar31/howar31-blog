<template><div><h1 id="install-zsh-oh-my-zsh-on-ubuntu" tabindex="-1"><a class="header-anchor" href="#install-zsh-oh-my-zsh-on-ubuntu"><span>Install zsh / oh-my-zsh on Ubuntu</span></a></h1>
<p>zsh是個很酷的shell，提供高度可自訂化的shell環境，更多詳細訊息請見 <a href="http://www.zsh.org/" target="_blank" rel="noopener noreferrer">zsh官方網站</a></p>
<p>本篇筆記如何在Ubuntu環境安裝zsh，並使用oh-my-zsh客製化zsh環境，部分指令與OS X上有些許出入，OS X的安裝請見 <a href="https://github.com/robbyrussell/oh-my-zsh" target="_blank" rel="noopener noreferrer">oh my zsh Github</a></p>
<p>原始教學參考自 <a href="http://www.youtube.com/watch?v=1S3MUVIAieE" target="_blank" rel="noopener noreferrer">AJ ONeal的YouTube教學影片</a></p>
<p><a href="https://gitlab.com/howar31/oh-my-zsh-powerline-theme" target="_blank" rel="noopener noreferrer">Dim Powerline Theme by Howar31</a></p>
<h2 id="requirement" tabindex="-1"><a class="header-anchor" href="#requirement"><span>Requirement</span></a></h2>
<ol>
<li>Ubuntu <em>本篇測試環境Ubuntu Server 12.10</em></li>
<li>bash 基本知識
<ul>
<li>例如 <code v-pre>pushd</code>、<code v-pre>popd</code>、<code v-pre>apt-get</code> 等等</li>
</ul>
</li>
<li>vim 基本知識 <em>或其它類似文字編輯器</em></li>
</ol>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation"><span>Installation</span></a></h2>
<h3 id="zsh" tabindex="-1"><a class="header-anchor" href="#zsh"><span>ZSH</span></a></h3>
<p><code v-pre>sudo apt-get update &amp;&amp; sudo apt-get install -y curl vim git zsh</code></p>
<p>上述指令做了五件事:</p>
<ol>
<li>更新apt-get</li>
<li>安裝curl</li>
<li>安裝vim</li>
<li>安裝git</li>
<li><strong>安裝zsh</strong></li>
</ol>
<p>除了zsh是核心之外，其它是在等等過程中會用到的工具，如果系統中原本就已經安裝最新版，則會自動跳過</p>
<h3 id="oh-my-zsh" tabindex="-1"><a class="header-anchor" href="#oh-my-zsh"><span>Oh My ZSH</span></a></h3>
<p>一行指令就能裝好</p>
<p><code v-pre>curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | bash</code></p>
<p><em>很多網站指令後面寫<code v-pre>sh</code>，但Ubuntu要改成<code v-pre>bash</code></em></p>
<h3 id="setting-default-shell" tabindex="-1"><a class="header-anchor" href="#setting-default-shell"><span>Setting Default Shell</span></a></h3>
<p>將zsh設定為目前使用者的預設shell</p>
<p><code v-pre>sudo chsh -s $(which zsh) $(whoami)</code></p>
<blockquote>
<p>$(which zsh) 表示找到zsh的位置</p>
<p>$(whoami) 表示目前使用者</p>
</blockquote>
<p>設定好後，可以手動到<code v-pre>home</code>的<code v-pre>.bashrc</code>看是否設定成功</p>
<h2 id="configure-zsh-by-oh-my-zsh" tabindex="-1"><a class="header-anchor" href="#configure-zsh-by-oh-my-zsh"><span>Configure ZSH by Oh My ZSH</span></a></h2>
<p>修改<code v-pre>home</code>的<code v-pre>.zshrc</code>即可</p>
<p><code v-pre>vim ~/.zshrc</code></p>
<p>佈景主題修改<code v-pre>ZSH_THEME=&quot;theme_name&quot;</code></p>
<p>佈景主題位置在<code v-pre>.oh-my-zsh/themes/</code>底下</p>
<p><a href="https://github.com/robbyrussell/oh-my-zsh/wiki/Themes" target="_blank" rel="noopener noreferrer">oh-my-zsh Theme Wiki</a></p>
<hr>
<blockquote>
<p>Written with <a href="http://benweet.github.io/stackedit/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


