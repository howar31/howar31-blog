<template><div><p><img src="@source/wordpress/3ds-max-8-braclet/images/GreenCaustics100GI100.jpg" alt=""></p>
<p>這是翡翠手鐲，有像嗎？有像嗎？XD</p>
<p>這次主要是練習3Ds Max內建Mental Ray的Refraction Caustics</p>
<p>==</p>
<p>所謂的Refraction Caustics，中文翻譯叫做「折射焦散」</p>
<p>呃翻譯後還是看不懂吧...xDDDDD</p>
<p>焦散(Caustics)簡單來說可以看成是一種渲染(Render)的演算法(Algorithm)</p>
<p>至於渲染是什麼...囧你確定要問下去？再問下去就沒玩沒了了:P</p>
<p>好啦簡單講一下XD</p>
<p>所謂的渲染(Render)就是用軟體從模型生成圖像的過程</p>
<p>至於演算法......呃不懂的人再來問我好了囧rz</p>
<p>==</p>
<p>回歸正題！</p>
<p>這次做翡翠手鐲其實是想要練習折射焦散</p>
<p>大家都知道光線透過了翡翠手鐲或玻璃杯之類的透明物體會產生折射的現象</p>
<p>而這種折射現象在3D繪圖時是要另外計算的</p>
<p>軟體根據光源、物體材質、材質係數等等各種資料算出來才行</p>
<p>有了折射焦散，透明的3D物體看起來會更逼真更真實！</p>
<p>==</p>
<p>說了這麼多可能很難懂xD</p>
<p>來看幾張圖片就懂了！</p>
<p><img src="@source/wordpress/3ds-max-8-braclet/images/GreenNoCaustics.jpg" alt=""></p>
<p>這張圖就是單純的3D建模，有打光、有材質，但是沒有啟動焦散計算</p>
<p><img src="@source/wordpress/3ds-max-8-braclet/images/GreenCaustics1GI1.jpg" alt=""></p>
<p>這張圖啟動了焦散功能，焦散光子設定為1、GI光子也設定為1</p>
<p><img src="@source/wordpress/3ds-max-8-braclet/images/GreenCaustics100GI100.jpg" alt=""></p>
<p>這張圖也是啟動了焦散，不過焦散光子設定為100、GI光子也設定為100</p>
<p>看了三張圖應該比較瞭解折射焦散是什麼了吧！😄</p>
<p>焦散光子和GI光子設定數值較高時看起來比較接近真實也比較漂亮</p>
<p>不過這樣子的畫質相對的要犧牲的就是運算時間</p>
<p>高設定的焦散計算要很長的時間的:P</p>
<p>==</p>
<p>在嘗試製作的過程中其實還有幾張圖片</p>
<p>我傳上來給大家看看XD</p>
<p>看看就好請不要問我翡翠手鐲為什麼是藍色...Orz</p>
<p><img src="@source/wordpress/3ds-max-8-braclet/images/1GI1.jpg" alt=""></p>
<p>焦散光子設定: 1</p>
<p>GI光子設定: 1</p>
<p><img src="@source/wordpress/3ds-max-8-braclet/images/100GI100.jpg" alt=""></p>
<p>焦散光子設定: 100</p>
<p>GI光子設定: 100</p>
<p>==</p>
<p>好啦！練習完折射焦散，下次就要練習反射焦散囉:D</p>
<p>喔有折射焦散當然也有反射焦散呀！😄</p>
<p>簡單舉個例子就像是游泳池水面上的漣漪在天花板產生波光粼粼這樣:D</p>
</div></template>


