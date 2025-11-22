<template><div><p><img src="@source/wordpress/plurk-theme/images/Plurk1.png" alt=""></p>
<p>噗浪(Plurk)是一個MicroBlog服務，在台灣受到熱烈歡迎，擁有許多使用者。除了河道顯示訊息的特別方式以外，噗浪還提供使用者使用自製CSS來展現個人河道特色。</p>
<p>我最近因為之前的佈景用很久了，而且當初是隨便弄弄不怎麼好看，所以這次想佈景就自己來做吧:D</p>
<p>大河道噗浪CSS佈景 - Design by Howar31</p>
<blockquote>
<ul>
<li>設計者: <a href="http://howar31.com" target="_blank" rel="noopener noreferrer">Howar31</a></li>
<li>範例網址: <a href="http://plurk.com/howar31" target="_blank" rel="noopener noreferrer">Howar31的Plurk</a></li>
<li>安裝佈景: <a href="http://www.plurk.com/installDesign/3295410-a14f28c712" target="_blank" rel="noopener noreferrer">http://www.plurk.com/installDesign/3295410-a14f28c712</a></li>
</ul>
</blockquote>
<p>範例網址就是我自己的噗浪，我目前正在使用這個佈景，不過以後我可能會換掉佈景，那到時候就請各位參考以下介紹的截圖囉:D</p>
<p>前面提到，噗浪的一大特色是河道訊息顯示，因此這次的佈景主要在於把河道放大，並且希望可以在不要上下捲動網頁的情況下裝入整個噗浪(也就是不想讓右邊出現捲軸)，因此原本預設在底下的個人資訊、卡馬、獎章、好友、粉絲那些得統統移走，這樣才有可能實現單一頁面的噗浪，這兩個重點是這次噗浪佈景製作的主題。</p>
<p>首先看幾張噗浪主要畫面:</p>
<p>尚未登入</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk1.png" alt=""></p>
<p>非本人登入</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_nome.png" alt=""></p>
<p>本人登入</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_main.png" alt=""></p>
<p>這邊順便圈了幾個特點來說明一下:</p>
<ul>
<li>左下角可見有新噗浪和未讀噗浪的通知區</li>
<li>左上角方框是未讀的噗浪，會有加深陰影標示</li>
<li>中間的圓圈是該噗浪的回應數，放大顯示:D</li>
<li>右邊的圓圈是原本私噗圖示，轉噗圖示也是顯示在這喔:D</li>
<li>最右上角沒框選的一個地方是發噗的位置，暫時隱藏在那邊，後面會介紹XD</li>
</ul>
<p>此外明顯可見的加大頭像，還有資訊面板全部移到左邊去了:D<br>
(喔對了我個人使用英文版的噗浪介面，但中文介面也測試過沒問題喔:D)</p>
<p>左邊的資訊面板在滑鼠滑過去的時候會展開:</p>
<p>個人資訊</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Friend_Info.png" alt=""></p>
<p>這個不管是本人、朋友、訪客登入都差不多，朋友的話會出現傳送私噗的按鈕，而有些人個人自介會打很多，或是有噗浪官方認證圖示，所以下方預留空間</p>
<p>卡馬資訊</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Friend_Karma.png" alt=""></p>
<p>這也是任何人看到都一樣，不過值得一提的是，下方獎章有些人拿很多，所以預留了第三排的空間，另外卡馬趨勢圖也移到右邊不要擋住其他資訊</p>
<p>朋友欄，訪客登入下方會有「加為好友」的按鈕</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Guest_Friend.png" alt=""></p>
<p>好友登入會有「不跟蹤」和「移除好友」的按鈕</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Friend_Friend.png" alt=""></p>
<p>而本人登入下面會有「搜尋噗友」的框框</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Friend.png" alt=""></p>
<p>粉絲欄，訪客登入下方會有「成為粉絲」和「封鎖」的按鈕</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Guest_Fans.png" alt=""></p>
<p>好友和本人登入都一樣</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Friend_Fans.png" alt=""></p>
<p>發噗的表格縮小到右上角，滑鼠滑過去的時候會自動展開</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Post.png" alt=""></p>
<p>再來是噗浪有內建視窗，採用透明邊框陰影設計:</p>
<p>噗浪設定</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Set_Profile.png" alt=""></p>
<p>好友設定</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Set_Friend.png" alt=""></p>
<p>內嵌圖片</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_in_pic.png" alt=""></p>
<p>內嵌影片</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_in_video.png" alt=""></p>
<p>另外這是噗浪單體</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_Plurk.png" alt=""></p>
<p>這邊可以清楚看到回文部份右邊有美化過的捲軸，不過這個只有webkit引擎有支援(也就是Chrome、Safari瀏覽器)，其他可能沒辦法看到喔:P</p>
<p>然後是噗浪單頁，單頁這部份平常不常看到，但有時候要分享單一噗浪的時候，訪客就會點進這樣的頁面，所以也稍加美化:D</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_single.png" alt=""></p>
<p>主要風格跟河道主頁一樣，改造重點是把底下的回文部份往上拉，盡量縮減網頁的長度，然後上一則、下一則導覽按鈕改在左上、右上角</p>
<p>以上截圖都是在1280x800的解析度下截的，而本佈景主題建議最低解析度為800x600，如果你的解析度更高，河道會自動放寬寬度，高度則不變維持在600px(以免最低解析度的使用者河道放不下)，相關面板也都會自己調整，不需要擔心:D (不過聽說高解析度螢幕，例如1920x1080，河道下面會空很大就是了...那...請把視窗縮小?!XDDD)</p>
<p>另外幾個小地方就是右下角的語言選擇，其實是隱藏了整個噗浪原始版權宣告等連結，滑鼠放在上面三秒就會浮現唷！還有就是原始碼裡面有一段是可以讓大家自己放Logo的，按照原始碼裡面的註解填上圖片資料，就可以顯示在河道右下方，有興趣的大家可以試試看！</p>
<p>最後是一些相容性的問題，這個佈景主題使用了大量的CSS3語法，不過CSS3語法目前還沒有完全普及，各家瀏覽器支援度不一樣。這個佈景我是在Ubuntu 11.04的Eclipse 3.7.0底下開發完成，經由Chrome 15.0.865.0 dev測試通過，所以如果使用Chrome就可以完整的看到這個佈景的所有功能，而Firefox或Opera只有極少數的小地方不支援(例如美化捲軸、淡入淡出動畫等)，而IE瀏覽器沒有測試過並且完全不支援，IE對CSS3的支援很差，所以這個佈景在IE看會有很多問題，我並不打算做個IE相容的版本，如果要遷就IE會犧牲掉很多東西，所以請各位使用先進的Chrome、Firefox、Opera或Safari瀏覽器吧！</p>
<p>(簡而言之，就是webkit引擎完美支援，moz引擎近乎完美，IE引擎爆炸。XD)</p>
<blockquote>
<p><strong>2011.09.08 更新</strong></p>
<p>這個佈景可以搭配噗浪內建的背景，在左上角我的噗浪旁點選編輯後可以看到這樣的選項:</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_set.png" alt=""></p>
<p>紅色圈框就是噗浪內建背景的設定，可以做各種搭配:</p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_black.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_blue.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_brown.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_carpet.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_dot.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_green.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_grey.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_hack.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_orange.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_pink.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_sky.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_weave.png" alt=""></p>
<p><img src="@source/wordpress/plurk-theme/images/Plurk_bg_white.png" alt=""></p>
</blockquote>
<p>呼呼整個佈景介紹大概是這樣，看圖不過癮，親自裝起來用用才知道！XD</p>
<p>喜歡這個佈景可以直接拿去用，也可以自己拿去做小修改來符合自己的使用需求，原始碼裡面都有寫註解，方便大家修改，不過希望大家還是可以把原作者我的名子「Howar31」留下來別砍掉囉:D 謝謝大家的支持！</p>
</div></template>


