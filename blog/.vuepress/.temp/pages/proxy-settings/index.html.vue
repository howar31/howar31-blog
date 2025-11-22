<template><div><h1 id="proxy-settings-note" tabindex="-1"><a class="header-anchor" href="#proxy-settings-note"><span>Proxy Settings Note</span></a></h1>
<div class="hint-container tip">
<p class="hint-container-title">Edit - 2019.09.16</p>
<ul>
<li>Add/Edit <a href="#git">Git</a> section.</li>
<li>Add command for NPM proxy</li>
<li>Fix typo</li>
</ul>
</div>
<p>There are so many different system or tool configs to set if you are behind a proxy.  This article simply note where and how to set them.</p>
<p>I will use these settings for the following example:</p>
<ul>
<li>Proxy Host: host</li>
<li>Proxy Port: 3128</li>
<li>Proxy User: username</li>
<li>Proxy Password: password</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>You need to <strong>URL encode</strong> your username or password if special characters contains.<br>
i.g. <em>whitespace</em> = <code v-pre>%20</code>, <em>&amp;</em> = <code v-pre>%26</code>, etc...</p>
</div>
<h2 id="ubuntu" tabindex="-1"><a class="header-anchor" href="#ubuntu"><span>Ubuntu</span></a></h2>
<p>Config file path: <code v-pre>/etc/environment</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">http_proxy</span><span class="token operator">=</span><span class="token string">"http://username:password@host:3128"</span></span>
<span class="line"><span class="token assign-left variable">http_proxy_request_fulluri</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">https_proxy</span><span class="token operator">=</span><span class="token string">"http://username:password@host:3128"</span></span>
<span class="line"><span class="token assign-left variable">https_proxy_request_fulluri</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">no_proxy</span><span class="token operator">=</span><span class="token string">"localhost, 127.0.*, 192.168.*, 10.*, *.local"</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">HTTP_PROXY</span><span class="token operator">=</span><span class="token string">"http://username:password@host:3128"</span></span>
<span class="line"><span class="token assign-left variable">HTTP_PROXY_REQUEST_FULLURI</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">HTTPS_PROXY</span><span class="token operator">=</span><span class="token string">"http://username:password@host:3128"</span></span>
<span class="line"><span class="token assign-left variable">HTTPS_PROXY_REQUEST_FULLURI</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">NO_PROXY</span><span class="token operator">=</span><span class="token string">"localhost, 127.0.*, 192.168.*, 10.*, *.local"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="apt-get" tabindex="-1"><a class="header-anchor" href="#apt-get"><span>apt-get</span></a></h2>
<p>Config file path: <code v-pre>/etc/apt/apt.conf.d/95proxies</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">Acquire::http::proxy <span class="token string">"http://username:password@host:3128"</span><span class="token punctuation">;</span></span>
<span class="line">Acquire::https::proxy <span class="token string">"http://username:password@host:3128"</span><span class="token punctuation">;</span></span>
<span class="line">Acquire::ftp::proxy <span class="token string">"ftp://username:password@host:3128"</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="npm" tabindex="-1"><a class="header-anchor" href="#npm"><span>NPM</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> proxy http://username:password@host:3128</span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> https-proxy http://username:password@host:3128</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>or manually add in config file path: <code v-pre>~/.npmrc</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">proxy</span><span class="token operator">=</span>http://username:password@host:3128/</span>
<span class="line">https-proxy<span class="token operator">=</span>http://username:password@host:3128/</span>
<span class="line">strict-ssl<span class="token operator">=</span>false</span>
<span class="line"><span class="token assign-left variable">registry</span><span class="token operator">=</span>http://registry.npmjs.org/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="git" tabindex="-1"><a class="header-anchor" href="#git"><span>Git</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> http.proxy http://username:password@host:3128</span>
<span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> https.proxy http://username:password@host:3128</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>or manually add in config file path: <code v-pre>~/.gitconfig</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>http<span class="token punctuation">]</span></span>
<span class="line">        proxy <span class="token operator">=</span> http://username:password@host:3128</span>
<span class="line"><span class="token punctuation">[</span>https<span class="token punctuation">]</span></span>
<span class="line">        proxy <span class="token operator">=</span> http://username:password@host:3128</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


