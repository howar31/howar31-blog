<template><div><h1 id="enable-pwa-support-for-vuepress" tabindex="-1"><a class="header-anchor" href="#enable-pwa-support-for-vuepress"><span>Enable PWA Support for VuePress</span></a></h1>
<p>PWAs, <strong>Progressive Web Applications</strong> are web applications which is loaded as a website, but can also provide native app functionalities, such as offline mode, push notification, hardware access, and more.  For more info about PWA, please read the articles metioned in <RouteLink to="/vuepress-pwa/#references">References</RouteLink>.</p>
<h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2>
<p>The environment I used:</p>
<ul>
<li>macOS Mojave, 10.14.3</li>
<li>VuePress 0.14.10</li>
</ul>
<p>I setup <a href="https://blog.howar31.com/" target="_blank" rel="noopener noreferrer">my blog</a> as a PWA successfully.  You may visit <a href="https://blog.howar31.com/" target="_blank" rel="noopener noreferrer">my blog</a> on your phone (Chrome on Android recommended) to see how it works.</p>
<h2 id="setup" tabindex="-1"><a class="header-anchor" href="#setup"><span>Setup</span></a></h2>
<p>Accroding to <a href="https://developers.google.com/web/fundamentals/app-install-banners/" target="_blank" rel="noopener noreferrer">Google's instruction</a>, to make a website support PWA, it needs to meet the following criteria:</p>
<ul>
<li>The web app is not already installed.
<ul>
<li>and <code v-pre>prefer_related_applications</code> is not <code v-pre>true</code>.</li>
</ul>
</li>
<li>Meets a user engagement heuristic (currently, the user has interacted with the domain for at least 30 seconds)</li>
<li>Includes a web <strong>app manifest</strong> that includes:
<ul>
<li><code v-pre>short_name</code> or <code v-pre>name</code></li>
<li><code v-pre>icons</code> must include a 192px and a 512px sized icons</li>
<li><code v-pre>start_url</code></li>
<li><code v-pre>display</code> must be one of: <code v-pre>fullscreen</code>, <code v-pre>standalone</code>, or <code v-pre>minimal-ui</code></li>
</ul>
</li>
<li>Served over <strong>HTTPS</strong> (required for service workers)</li>
<li>Has registered a <strong>service worker</strong> with a <code v-pre>fetch</code> event handler</li>
</ul>
<p>While all the criteria above are met, the visitors will see a mini info bar on their screen, click on which will pop a dialog that allow user to install the website as an app.</p>
<p>Let's see how to do this.  It's simple that can be done in minutes with following steps.</p>
<h3 id="config-service-worker" tabindex="-1"><a class="header-anchor" href="#config-service-worker"><span>Config Service Worker</span></a></h3>
<p>To enable the service workder in VuePress, edit <code v-pre>.vuepress/config.js</code> and add the line:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line highlighted">    <span class="token literal-property property">serviceWorker</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// more configs</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After this config, VuePress will now generate a service worker while building the website.  Please note that the service worker requires <strong>HTTPS</strong> to work.</p>
<h3 id="config-manifest" tabindex="-1"><a class="header-anchor" href="#config-manifest"><span>Config Manifest</span></a></h3>
<p>PWA needs manifest and icon to work.  Edit <code v-pre>.vuepress/config.js</code> and add the line:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">head</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token string">'link'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">rel</span><span class="token operator">:</span> <span class="token string">'manifest'</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">'/manifest.json'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token string">'link'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">rel</span><span class="token operator">:</span> <span class="token string">'icon'</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">'/icon.png'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// more configs</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Then create <code v-pre>manifest.json</code> under <code v-pre>.vuepress/public/</code> with content:</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"PWA WebSite"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"short_name"</span><span class="token operator">:</span> <span class="token string">"PWA Site"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"icons"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">"src"</span><span class="token operator">:</span> <span class="token string">"icon.png"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"sizes"</span><span class="token operator">:</span> <span class="token string">"512x512"</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"image/png"</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"start_url"</span><span class="token operator">:</span> <span class="token string">"/index.html"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"display"</span><span class="token operator">:</span> <span class="token string">"standalone"</span><span class="token punctuation">,</span>  <span class="token comment">// or fullscreen, or minimal-ui</span></span>
<span class="line">  <span class="token property">"background_color"</span><span class="token operator">:</span> <span class="token string">"#FFFFFF"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"theme_color"</span><span class="token operator">:</span> <span class="token string">"#272822"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You may change the content above based on your website.</p>
<p>And then place your icon image under <code v-pre>.vuepress/public/</code> also.  Please note that the image must be as least <strong>512px</strong> sized.</p>
<h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion"><span>Conclusion</span></a></h2>
<p>You may verify your PWA by using Chrome dev-tool's Audit tool.  Or manually visit your website on your phone at least twice in 30 seconds to see if the mini info bar shows up.</p>
<h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Progressive_web_applications" target="_blank" rel="noopener noreferrer">PWA</a> on Wikipeida</li>
<li><a href="https://developers.google.com/web/progressive-web-apps/" target="_blank" rel="noopener noreferrer">Progressive Web Apps</a> on Google Developers | Web</li>
</ul>
</div></template>


