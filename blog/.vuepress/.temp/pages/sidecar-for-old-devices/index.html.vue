<template><div><h1 id="enable-sidecar-for-old-devices" tabindex="-1"><a class="header-anchor" href="#enable-sidecar-for-old-devices"><span>Enable Sidecar for Old Devices</span></a></h1>
<div class="hint-container warning">
<p class="hint-container-title">Edit - 2019.08.06</p>
<p>Methods mentioned in this post is no longer working in the latest beta version of macOS (10.15 Beta (19A526h)).</p>
</div>
<div class="hint-container tip">
<p class="hint-container-title">Edit - 2019.07.05</p>
<ul>
<li>Add some tips.</li>
</ul>
</div>
<p>The public beta of iPadOS and macOS Catalina is currently live for everyone now.  You may go to <a href="http://beta.apple.com/" target="_blank" rel="noopener noreferrer">Apple website</a> for more detail info about public beta.</p>
<p>The Sidecar is a hot feature which let you connect your iPad to Mac wireless or wired.  But this feature is actually limited to newer Apple devices.  My Macbook Air Early 2015 was not showing the &quot;Sidecar&quot; icon in System Preference, neither my iPad Pro 11&quot; showing up in my MBA's AirDisplay menu.</p>
<p>Fortunately, we can manually enable the Sidecar support on older devices with terminal commands.</p>
<h2 id="enable-sidecar-with-terminal-commands" tabindex="-1"><a class="header-anchor" href="#enable-sidecar-with-terminal-commands"><span>Enable Sidecar with Terminal Commands</span></a></h2>
<h3 id="tl-dr-for-one-liner" tabindex="-1"><a class="header-anchor" href="#tl-dr-for-one-liner"><span>TL;DR for One-liner</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">defaults <span class="token function">write</span> com.apple.sidecar.display AllowAllDevices <span class="token parameter variable">-bool</span> <span class="token boolean">true</span><span class="token punctuation">;</span> defaults <span class="token function">write</span> com.apple.sidecar.display hasShownPref <span class="token parameter variable">-bool</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token function">open</span> /System/Library/PreferencePanes/Sidecar.prefPane</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Then logout and re-login your macbook.</p>
<h3 id="commands-explain" tabindex="-1"><a class="header-anchor" href="#commands-explain"><span>Commands Explain</span></a></h3>
<p>My devices:</p>
<ul>
<li>MacBook Air (13-inch, Early 2015)
<ul>
<li>macOS Catalina 10.15 Beta (19A487m)</li>
</ul>
</li>
<li>iPad Pro 11&quot; (MTXP2TA/A)
<ul>
<li>iPadOS 13.0 (17A5508m)</li>
</ul>
</li>
</ul>
<p>I've tried the following commands and successfully connect my iPad Pro to my Macbook Air.</p>
<p><img src="@source/sidecar-for-old-devices/images/photo.jpg" alt="Photo"></p>
<p>First, open terminal on your macbook and use this command:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">defaults <span class="token function">write</span> com.apple.sidecar.display AllowAllDevices <span class="token parameter variable">-bool</span> <span class="token boolean">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>The command is quite self-explained that it will enable Sidecar on all devices.</p>
<p>Second, the command:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">defaults <span class="token function">write</span> com.apple.sidecar.display hasShownPref <span class="token parameter variable">-bool</span> <span class="token boolean">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This will enable the icon in your System Preferences.</p>
<p><img src="@source/sidecar-for-old-devices/images/sidecar_preference_icon.png" alt="Sidecar Preference Icon"></p>
<p>And the last one is optional:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">open</span> /System/Library/PreferencePanes/Sidecar.prefPane</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This command will immediately open the Sidecar preference.</p>
<p><img src="@source/sidecar-for-old-devices/images/sidecar_preference.png" alt="Sidecar Preference"></p>
<p>And now you have to logout and re-login your Macbook or you might find that your iPad is not showing in the preference.</p>
<h2 id="quick-review-about-sidecar" tabindex="-1"><a class="header-anchor" href="#quick-review-about-sidecar"><span>Quick Review about Sidecar</span></a></h2>
<p>The Sidecar feature is currently in beta.  Many feature feels buggy right now.  As I notice it's quite laggy even using USB-C wired connection.  And the graphic is glitching on iPad display.  Hope these issues will be solved and improved while official release.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>To use the Sidecar, you have to enable the Bluetooth on both Macbook and iPad no matter you are connecting Sidecar with wired or wireless.</p>
<p>For wireless connection, you also have to enable WiFi on both devices.  The WiFi does not need the Internet connection to make Sidecar work.</p>
</div>
<h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2>
<ul>
<li><a href="https://www.reddit.com/r/apple/comments/bx3eet/sidecar_support_on_older_macs/" target="_blank" rel="noopener noreferrer">Reddit - Sidecar support on older Macs</a></li>
</ul>
</div></template>


