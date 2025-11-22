<template><div><h1 id="使用javascript-左邊補零固定字串長度" tabindex="-1"><a class="header-anchor" href="#使用javascript-左邊補零固定字串長度"><span>使用JavaScript 左邊補零固定字串長度</span></a></h1>
<p>有時數字字串要固定長度，需要在左邊或右邊補零，例如:</p>
<blockquote>
<p><strong>123</strong> 左邊補零為八位數 <strong>00000123</strong><br>
<strong>54321</strong> 左邊補零為八位數 <strong>00054321</strong></p>
</blockquote>
<p>以下簡短的JavaScript程式碼片段利用recursive即可達到這個效果:</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code class="language-javascript"><span class="line"><span class="token keyword">function</span> <span class="token function">padleft</span> <span class="token punctuation">(</span><span class="token parameter">YourNumber<span class="token punctuation">,</span> OutputLength</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>YourNumber<span class="token punctuation">.</span>length <span class="token operator">>=</span> OutputLength<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> YourNumber<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">padleft</span><span class="token punctuation">(</span><span class="token string">"0"</span> <span class="token operator">+</span>YourNumber<span class="token punctuation">,</span> OutputLength<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>要改為右邊補零，只需要修改return值即可</p>
<blockquote>
<p>Written with <a href="https://stackedit.io/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


