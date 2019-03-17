---
title: "Android Studio VCS使用GitHub"
date: "2013-06-06"
---

使用Android Studio整合GitHub做VCS，不過Android Studio還沒完全，過程中碰到一些問題  

> 測試環境  
> 
> - Android Studio 0.1.3 Build AI-130.700763
> - JDK 1.7.0\_10 64bit
> - GitHub for Windows Version 1.0.48.0

  
  
設定環境  
  

- [安裝Android Stuido](http://developer.android.com/sdk/installing/studio.html)

  
安裝GitHub client  
  

- [GitHub for Mac](http://mac.github.com/)
- [GitHub for Windows](http://windows.github.com/)
- [GitHub for Eclipse](http://eclipse.github.com/)

  
Android Studio環境設定  
  

- Git

- 功能表列=>「Files」=>「Settings」(Ctrl + Alt + S)
- 「Project Settings」=>「Version Control」=>「Git」
- 修正「Path to Git executable」的位置，找到git.exe

- Windows 7 安裝GitHub client後預設git.exe的位置
- C:\\Users\\User\\AppData\\Local\\GitHub\\hqg3slvi.kac\\bin\\git.exe

- 按「Test」測試設定有沒有問題

- GitHub

- 功能表列=>「Files」=>「Settings」(Ctrl + Alt + S)
- 「Project Settings」=>「Version Control」=>「GitHub」
- Login輸入GitHub的帳號
- Password輸入GitHub的密碼
- 按「Test」測試設定有沒有問題
- 下方「Apply」後Android Studio會要你設定令一組Master Password，用來保護Android Studio裡面的其他password list

  
創建repository  
  

- 在Android Studio上方功能表列選「VCS」=>「Import into Version Control」=>「Share project on GitHub」

- 這邊如果跳出錯誤「project is already under git with configured remote」，表示這個project之前已經被設定過local repository了，請到project的資料夾下刪除「.git」資料夾即可

- 輸入Name和Description，這邊Name就是等等會在GitHub上建立的Repository名稱
- 應該是因為Android Studio還沒完備的關係，會跳出錯誤「fatal: remote origin already exists」需要手動排除

- 使用command line

- Windows使用者不是打開Windows的cmd.exe，請到開始功能表找Git Shell

- 「git remote -v」，看到「origin」已經被建立，但沒有設定URI，因此需要手動設定
- 「git remote set-url origin URI」，手動設定

- 回到Android Studio，下方有一個「9: Changes」的tab，點開有檔案被歸類在Unrevisionized，按右鍵選「Add to VCS」 (也就是git add)
- 回到command line，手動做第一次commit，「git commit -m "First manaul commit"」

- 不用先add，剛剛在Android Studio裡面用GUI add過了

- 然後手動做第一次push，「git push --set-upstream origin master」，設定branch為master
- 完成！之後就不需要command line了，在Android Studio裡面GUI操作即可
