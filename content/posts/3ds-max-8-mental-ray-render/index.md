---
title: "3Ds Max 8 Mental Ray Render 各種材質效果比較"
date: "2009-04-15"
categories:
  - wordpress
---

>   
> 
> Mental Ray 是 3Ds Max 內建的一個渲染器(Render)
> 
>   

  

我搭配了不同的材質來測試效果和效能

  

以下列出19種不同的測試結果

  

P.S.杯子原本的材質顏色就是黃色，不過很多圖因為使用光線追蹤所以看不到黃色

  

\==

  

![](./images/GlassCup5BStandard5D5BPhoton15D5BGI15D5B5s5D.jpg)

  

Standard材質

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 5秒

  

![](./images/GlassCup5BStandard5D5BPhoton1005D5BGI1005D5B72s5D.jpg)

  

  

Standard材質

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 72秒

  

![](./images/GlassCup5BStandard5D5BReflect5D5BPhoton15D5BGI15D5B74s5D.jpg)

  

  

Standard材質

  

Ray Trace: 反射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 74秒

  

![](./images/GlassCup5BStandard5D5BReflect5D5BRefract5D5BPhoton15D5BGI15D5B144s5D.jpg)

  

  

Standard材質

  

Ray Trace: 反射

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 144秒

  

![](./images/GlassCup5BStandard5D5BRefract5D5BPhoton15D5BGI15D5B15s5D.jpg)

  

  

Standard材質

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 15秒

  

![](./images/GlassCup5BStandard5D5BRefract5D5BPhoton1005D5BGI1005D5B87s5D.jpg)

  

  

Standard材質

  

Ray Trace: 折射

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 87秒

  

![](./images/GlassCup5BStandard5D5BSpecular5D5BPhoton15D5BGI15D5B50s5D.jpg)

  

  

Standard材質

  

Ray Trace: 高光顏色

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 50秒

  

![](./images/GlassCup5BStandard5D5BSpecular5D5BReflect5D5BRefract5D5BPhoton15D5BGI15D5B1936s5D.jpg)

  

  

Standard材質

  

Ray Trace: 高光顏色

  

Ray Trace: 反射

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 1936秒

  

![](./images/GlassCup5BStandard5D5BSpecular5D5BRefract5D5BPhoton15D5BGI15D5B182s5D.jpg)

  

  

Standard材質

  

Ray Trace: 高光顏色

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 182秒

  

![](./images/GlassCup5BStandard5D5BTrans5D5BPhoton15D5BGI15D5B159s5D.jpg)

  

  

Standard材質

  

Ray Trace: 透明

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 159秒

  

![](./images/GlassCup5BStandard5D5BTrans5D5BPhoton1005D5BGI1005D5B291s5D.jpg)

  

  

Standard材質

  

Ray Trace: 透明

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 291秒

  

![](./images/GlassCup5BStandard5D5BTrans5D5BReflect5D5BRefract5D5BPhoton15D5BGI15D5B2222s5D.jpg)

  

  

Standard材質

  

Ray Trace: 透明

  

Ray Trace: 反射

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 2222秒

  

![](./images/GlassCup5BStandard5D5BTrans5D5BRefract5D5BPhoton15D5BGI15D5B194s5D.jpg)

  

  

Standard材質

  

Ray Trace: 透明

  

Ray Trace: 折射

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 194秒

  

![](./images/GlassCup5BRayTrace5D5BBiFace5D5BPhoton15D5BGI15D5B20s5D.jpg)

  

  

Ray Trace材質

  

雙面

  

焦散光子: 1

  

GI光子: 1

  

運算耗時: 20秒

  

![](./images/GlassCup5BRayTrace5D5BBiFace5D5BPhoton1005D5BGI1005D5B82s5D.jpg)

  

  

Ray Trace材質

  

雙面

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 82秒

  

![](./images/GlassCup5BRayTrace5D5BPhoton1005D5BGI1005D5B96s5D.jpg)

  

  

Ray Trace材質

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 96秒

  

![](./images/GlassCup5BRayTrace5D5BBiFace5D5BNoReflect5D5BPhoton1005D5BGI1005D5B83s5D.jpg)

  

  

Ray Trace材質

  

雙面

  

反射: 0

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 83秒

  

![](./images/GlassCup5BRayTrace5D5BBiFace5D5BReflect105D5BPhoton1005D5BGI1005D5B69s5D.jpg)

  

  

Ray Trace材質

  

雙面

  

反射: 10

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 69秒

  

![](./images/GlassCup5BRayTrace5D5BBiFace5D5BReflect205D5BPhoton1005D5BGI1005D5B82s5D.jpg)

  

  

Ray Trace材質

  

雙面

  

反射: 20

  

焦散光子: 100

  

GI光子: 100

  

運算耗時: 82秒

  

\==

  

以上是19種各種材質的設定

  

不是所有材質設定組合都有測試，因為有些要算很久跑不出來...Orz

  

經過這樣的測試，我覺得直接使用Ray Trace材質並設定雙面、反射10效果不錯，又快又好看

  

反射設定20室友說反射太強不自然xDrz

  

總之設定玻璃材質直接使用Ray Trace材質而不要使用Standard材質比較好:D
