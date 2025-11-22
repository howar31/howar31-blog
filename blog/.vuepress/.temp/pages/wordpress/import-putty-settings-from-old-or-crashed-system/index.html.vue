<template><div><h1 id="從老舊或損毀的系統中取回putty設定" tabindex="-1"><a class="header-anchor" href="#從老舊或損毀的系統中取回putty設定"><span>從老舊或損毀的系統中取回Putty設定</span></a></h1>
<blockquote>
<p>Reference: <a href="http://www.miniservernation.com/2012/05/putty-import-settings-from-old-hdd-or-crashed-system/" target="_blank" rel="noopener noreferrer">Putty: Import settings from old HDD or crashed system</a></p>
</blockquote>
<p>Putty只有單一一個exe檔即可執行，不需要外掛dll等附加檔案，但是Putty的設定檔卻都存在Windows的登錄檔(Registry)裡面，不但造成可攜性(portability)降低、也讓系統損毀或更換時轉移設定的麻煩。</p>
<p>一般轉移Putty設定檔，只匯出匯入登錄檔即可，但如果發生硬碟故障或系統損毀，造成舊系統無法開機，這時候要拿設定檔就沒辦法直接操作。本篇步驟可幫助你在無法啟動舊系統的情況下，直接從新系統撈回Putty設定檔！</p>
<h2 id="適用條件" tabindex="-1"><a class="header-anchor" href="#適用條件"><span>適用條件</span></a></h2>
<ul>
<li>系統或硬碟損毀，但狀況輕微或有備份，仍可存取資料</li>
<li>舊系統登錄檔檔案(NTUSER.DAT)仍然完整可存取</li>
</ul>
<h2 id="救援步驟" tabindex="-1"><a class="header-anchor" href="#救援步驟"><span>救援步驟</span></a></h2>
<p>以下步驟需按照順序不可跳過或省略</p>
<ol>
<li>在新系統上先執行一次Putty，讓Putty在新系統的Registry內建立entry</li>
<li>關閉Putty</li>
<li>點選「開始_(Start)<em>」&gt;「執行</em>(Run)_」(Win + R)，輸入「regedit」開啟登錄檔編輯器(Registry Editor)</li>
<li>登錄檔編輯器左邊，點選「HKEY_LOCAL_MACHINE」</li>
<li>點選「檔案_(File)<em>」&gt;「載入 Hive 控制檔</em>(Load Hive)_」</li>
<li>接下來需要找到舊系統登錄檔的位置，請到舊的使用者設定資料夾內，例如: <code v-pre>D:\Users\myusername\NTUSER.DAT</code></li>
</ol>
<blockquote>
<p>注意，這邊如果找不到檔案，先檢查是否有開啟顯示隱藏系統檔:<br>
1. 開啟「我的電腦_(My Computer)<em>」<br>
2. 工具列點選「工具</em>(Tools)<em>」&gt;「資料夾選項</em>(Folder Options)<em>」<br>
3. 標籤「檢視</em>(View)<em>」&gt;「進階設定</em>(Advanced Settings)<em>」<br>
4. <strong>不要</strong>勾選「隱藏保護的系統檔案</em>(Hide protected operating system files)<em>」<br>
5. 按「確定</em>(OK)_」後即可<br>
如果這邊找不到或無法存取NTUSER.DAT可能就沒救了</p>
</blockquote>
<ol>
<li>找到檔案後點選，會跳出一個詢問對話框，要求輸入一個名字，例如: <code v-pre>old-registry</code></li>
<li>現在在「HKEY_LOCAL_MACHINE」底下可以看到剛剛新增的entry <code v-pre>old-registry</code></li>
<li>展開 <code v-pre>HKEY_LOCAL_MACHINE\old-registry\Software\SimonTatham</code></li>
<li>右鍵點選「SimonTatham」選擇「匯出_(Export)_」</li>
<li>選擇匯出存檔位置與名稱，例如: <code v-pre>putty-config.reg</code></li>
<li>剛剛的 <code v-pre>old-registry</code> 已經用不到了，點選 <code v-pre>old-registry</code> ，<strong>注意務必要選對 <code v-pre>old-registry</code></strong> ，然後選「檔案_(File)<em>」&gt;「卸除 Hive 控制檔</em>(Unload Hive)_」</li>
<li>成功卸載後，關閉登錄檔編輯器_(Registry Editor)_</li>
<li>找到剛剛匯出的登錄檔 <code v-pre>putty-config.reg</code> ，按右鍵「編輯_(Edit)_」，用記事本(或文字編輯器)開啟</li>
<li>將所有「HKEY_LOCAL_MACHINE\old-registry」取代為「HKEY_CURRENT_USER」</li>
<li>儲存檔案並關閉 <code v-pre>putty-config.reg</code></li>
<li>點兩下 <code v-pre>putty-config.reg</code> 跳出登錄檔合併確認視窗，點選確定開始合併</li>
<li>合併成功後，開啟Putty就會發現舊的設定檔都回來了！</li>
</ol>
<h2 id="後記" tabindex="-1"><a class="header-anchor" href="#後記"><span>後記</span></a></h2>
<p>Putty用Registry存設定真的很麻煩，所以也有網友自行重新編譯Putty，將存檔機制重寫，讓Putty的設定改存在一個檔案中，如果有需要可以參考使用: <a href="http://jakub.kotrla.net/putty/" target="_blank" rel="noopener noreferrer">PuTTY for win32 storing configuration into file</a></p>
<blockquote>
<p>Written with <a href="https://stackedit.io/" target="_blank" rel="noopener noreferrer">StackEdit</a>.</p>
</blockquote>
</div></template>


