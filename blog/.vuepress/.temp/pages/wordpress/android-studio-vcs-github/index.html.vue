<template><div><p>使用Android Studio整合GitHub做VCS，不過Android Studio還沒完全，過程中碰到一些問題</p>
<blockquote>
<p>測試環境</p>
<ul>
<li>Android Studio 0.1.3 Build AI-130.700763</li>
<li>JDK 1.7.0_10 64bit</li>
<li>GitHub for Windows Version 1.0.48.0</li>
</ul>
</blockquote>
<p>設定環境</p>
<ul>
<li><a href="http://developer.android.com/sdk/installing/studio.html" target="_blank" rel="noopener noreferrer">安裝Android Stuido</a></li>
</ul>
<p>安裝GitHub client</p>
<ul>
<li><a href="http://mac.github.com/" target="_blank" rel="noopener noreferrer">GitHub for Mac</a></li>
<li><a href="http://windows.github.com/" target="_blank" rel="noopener noreferrer">GitHub for Windows</a></li>
<li><a href="http://eclipse.github.com/" target="_blank" rel="noopener noreferrer">GitHub for Eclipse</a></li>
</ul>
<p>Android Studio環境設定</p>
<ul>
<li>
<p>Git</p>
</li>
<li>
<p>功能表列=&gt;「Files」=&gt;「Settings」(Ctrl + Alt + S)</p>
</li>
<li>
<p>「Project Settings」=&gt;「Version Control」=&gt;「Git」</p>
</li>
<li>
<p>修正「Path to Git executable」的位置，找到git.exe</p>
</li>
<li>
<p>Windows 7 安裝GitHub client後預設git.exe的位置</p>
</li>
<li>
<p>C:\Users\User\AppData\Local\GitHub\hqg3slvi.kac\bin\git.exe</p>
</li>
<li>
<p>按「Test」測試設定有沒有問題</p>
</li>
<li>
<p>GitHub</p>
</li>
<li>
<p>功能表列=&gt;「Files」=&gt;「Settings」(Ctrl + Alt + S)</p>
</li>
<li>
<p>「Project Settings」=&gt;「Version Control」=&gt;「GitHub」</p>
</li>
<li>
<p>Login輸入GitHub的帳號</p>
</li>
<li>
<p>Password輸入GitHub的密碼</p>
</li>
<li>
<p>按「Test」測試設定有沒有問題</p>
</li>
<li>
<p>下方「Apply」後Android Studio會要你設定令一組Master Password，用來保護Android Studio裡面的其他password list</p>
</li>
</ul>
<p>創建repository</p>
<ul>
<li>
<p>在Android Studio上方功能表列選「VCS」=&gt;「Import into Version Control」=&gt;「Share project on GitHub」</p>
</li>
<li>
<p>這邊如果跳出錯誤「project is already under git with configured remote」，表示這個project之前已經被設定過local repository了，請到project的資料夾下刪除「.git」資料夾即可</p>
</li>
<li>
<p>輸入Name和Description，這邊Name就是等等會在GitHub上建立的Repository名稱</p>
</li>
<li>
<p>應該是因為Android Studio還沒完備的關係，會跳出錯誤「fatal: remote origin already exists」需要手動排除</p>
</li>
<li>
<p>使用command line</p>
</li>
<li>
<p>Windows使用者不是打開Windows的cmd.exe，請到開始功能表找Git Shell</p>
</li>
<li>
<p>「git remote -v」，看到「origin」已經被建立，但沒有設定URI，因此需要手動設定</p>
</li>
<li>
<p>「git remote set-url origin URI」，手動設定</p>
</li>
<li>
<p>回到Android Studio，下方有一個「9: Changes」的tab，點開有檔案被歸類在Unrevisionized，按右鍵選「Add to VCS」 (也就是git add)</p>
</li>
<li>
<p>回到command line，手動做第一次commit，「git commit -m &quot;First manaul commit&quot;」</p>
</li>
<li>
<p>不用先add，剛剛在Android Studio裡面用GUI add過了</p>
</li>
<li>
<p>然後手動做第一次push，「git push --set-upstream origin master」，設定branch為master</p>
</li>
<li>
<p>完成！之後就不需要command line了，在Android Studio裡面GUI操作即可</p>
</li>
</ul>
</div></template>


