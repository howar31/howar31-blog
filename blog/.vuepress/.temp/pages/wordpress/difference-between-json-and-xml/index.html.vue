<template><div><h2 id="json與xml差異比較" tabindex="-1"><a class="header-anchor" href="#json與xml差異比較"><span>JSON與XML差異比較</span></a></h2>
<p>JSON與XML是兩種常見的資料表示方式，雖然類似但是仍有一些不同的地方，在使用上也有些差異。</p>
<h2 id="definition" tabindex="-1"><a class="header-anchor" href="#definition"><span>Definition</span></a></h2>
<p>根據維基百科的定義:</p>
<blockquote>
<p><strong>JSON</strong>, or <strong>JavaScript Object Notation</strong>, is an open standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs. It is used primarily to transmit data between a server and web application, as an alternative to XML.</p>
</blockquote>
<p><a href="http://en.wikipedia.org/wiki/JSON" target="_blank" rel="noopener noreferrer">JSON</a> 是一種Object Notation，使用人類易讀的表示方式，來傳遞資料物件的一種標準格式，常用於網路應用程式與伺服器溝通。雖然JSON一開始是由JavaScript發展出來，但他是一個完全language-independent的資料格式，許多的程式語言都可以使用他。</p>
<blockquote>
<p><strong>Extensible Markup Language</strong> (<strong>XML</strong>) is a markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable. It is defined in the XML 1.0 Specification produced by the W3C, and several other related specifications, all free open standards.</p>
</blockquote>
<p><a href="http://en.wikipedia.org/wiki/XML" target="_blank" rel="noopener noreferrer">XML</a> 是一種Markup Language，用以將文件加上人類和機器皆可讀的標記，來格式化文件，最早由W3C制定規格。</p>
<h2 id="difference" tabindex="-1"><a class="header-anchor" href="#difference"><span>Difference</span></a></h2>
<p><em>以下採用<a href="http://stackoverflow.com/questions/2620270/what-is-the-difference-between-json-and-xml" target="_blank" rel="noopener noreferrer">Stack Overflow網友提供的解答</a>說明</em></p>
<p>最基礎的差異，就如他們的名字所表示，<strong>XML</strong>是一種_Markup Language_，而<strong>JSON</strong>是一種_Object Notation_。</p>
<hr>
<p>Markup Language 顧名思義就是在純文字上以標記的方式添加額外資訊的一種方法，例如這裡有一串純文字:</p>
<p><code v-pre>Here is some text.</code></p>
<p>使用XML將之格式化後:</p>
<div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML"><pre v-pre><code class="language-XML"><span class="line">&lt;Document&gt;</span>
<span class="line">    &lt;Paragraph Align=&quot;Center&quot;&gt;</span>
<span class="line">        Here &lt;Bold&gt;is&lt;/Bold&gt; some text.</span>
<span class="line">    &lt;/Paragraph&gt;</span>
<span class="line">&lt;/Document&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>這很清楚的展現了Markup Language在呈現文件是有多麼的好用。</p>
<p>而像是JSON這樣的Object Notation則沒有Markup Language那麼的彈性自由，不過這是好事，通常想要呈現物件的時候，都不太需要彈性自由，只要能簡單呈現即可。</p>
<p>如果要使用JSON表示上面XML的範例，首先必須手動解決一些XML有幫你處理好的細節:</p>
<div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre v-pre><code class="language-JSON"><span class="line">{</span>
<span class="line">    &quot;Paragraphs&quot;: [</span>
<span class="line">        {</span>
<span class="line">            &quot;align&quot;: &quot;center&quot;,</span>
<span class="line">            &quot;content&quot;: [</span>
<span class="line">                &quot;Here &quot;, {</span>
<span class="line">                    &quot;style&quot; : &quot;bold&quot;,</span>
<span class="line">                    &quot;content&quot;: [ &quot;is&quot; ]</span>
<span class="line">                },</span>
<span class="line">                &quot; some text.&quot;</span>
<span class="line">            ]</span>
<span class="line">        }</span>
<span class="line">    ]</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>這看起來沒有XML簡潔，原因就是因為我們想用Object Notation來呈現Markup Language的格式，因此需要「發明」一些欄位來裝一些格式化的資訊、陣列或物件。</p>
<hr>
<p>換個角度來看，如果你有一個典型的階層架構物件想要呈現，JSON就會比XML來的更加適合:</p>
<div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre v-pre><code class="language-JSON"><span class="line">{</span>
<span class="line">    &quot;firstName&quot;: &quot;Homer&quot;,</span>
<span class="line">    &quot;lastName&quot;: &quot;Simpson&quot;,</span>
<span class="line">    &quot;relatives&quot;: [ &quot;Grandpa&quot;, &quot;Marge&quot;, &quot;The Boy&quot;, &quot;Lisa&quot;, &quot;I think that's all of them&quot; ]</span>
<span class="line">} </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>這是邏輯上等價的XML表示方法:</p>
<div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML"><pre v-pre><code class="language-XML"><span class="line">&lt;Person&gt;</span>
<span class="line">    &lt;FirstName&gt;Homer&lt;/FirstName&gt;</span>
<span class="line">    &lt;LastName&gt;Simpsons&lt;/LastName&gt;</span>
<span class="line">    &lt;Relatives&gt;</span>
<span class="line">        &lt;Relative&gt;Grandpa&lt;/Relative&gt;</span>
<span class="line">        &lt;Relative&gt;Marge&lt;/Relative&gt;</span>
<span class="line">        &lt;Relative&gt;The Boy&lt;/Relative&gt;</span>
<span class="line">        &lt;Relative&gt;Lisa&lt;/Relative&gt;</span>
<span class="line">        &lt;Relative&gt;I think that's all of them&lt;/Relative&gt;</span>
<span class="line">    &lt;/Relatives&gt;</span>
<span class="line">&lt;/Person&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由上面的比較可以清楚看到，JSON比較像是我們在寫程式宣告物件的方式，也少了很多冗贅繁複的多餘標籤。</p>
<p>另外最重要的一點是，Object Notation有明確的標準格式來區分 <em>record</em> 和 <em>list</em></p>
<blockquote>
<p><strong>record</strong> 內含物件未排序，使用名稱做識別<br>
<strong>list</strong> 內含物件有排序，使用位置(index)做識別</p>
</blockquote>
<p>Object Notation一定要有這樣的規範標準，不然就完全無法使用。而相對的Markup Language就沒有這種區分，以上面的XML為例，<code v-pre>&lt;person&gt;</code>是一個_record_、而<code v-pre>&lt;Relatives&gt;</code>是一個_list_，但是你沒辦法輕鬆的從他的syntax中看出來。</p>
<p>相對的，Markup Language有 <em>elements</em> 和 <em>attributes</em> 的概念，這和Object Notation的 <em>record</em> 和 <em>list</em> 又是不同的東西。</p>
<p>透過額外的schema和user-defined attributes，當然也可以用XML實作 <em>record</em> 和 <em>list</em> 這樣標記的效果，而JSON的優點就是他內建了這樣的規範，簡單清楚又泛用，也就是說JSON的 <em>self describing</em> 比較好，這也是Markup Language和Object Notation所共同想達到的目標。</p>
<p><strong>所以，當要使用Object Notation時，JSON當然是首選，若要做document markup，則XML會更優。</strong></p>
<blockquote>
<p>Written with <a href="https://stackedit.io/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


