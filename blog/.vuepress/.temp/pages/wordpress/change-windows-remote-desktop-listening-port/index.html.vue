<template><div><h1 id="修改windows遠端桌面連線port" tabindex="-1"><a class="header-anchor" href="#修改windows遠端桌面連線port"><span>修改Windows遠端桌面連線Port</span></a></h1>
<ol>
<li>Open Registry Editor: <code v-pre>Win + R</code> &gt; <code v-pre>regedit</code></li>
<li>Navigate to registry on the left: <code v-pre>HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Terminal Server\WinStations\</code></li>
<li>Select entry on the right: <code v-pre>PortNumber</code></li>
<li>Edit the value you want. <strong>Remember select Decimal base unless you know you are entering hex value.</strong></li>
<li>Restart you computer.</li>
</ol>
<blockquote>
<p>Written with <a href="https://stackedit.io/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


