---
title: "Git入門常用指令教學"
date: "2013-06-01"
categories:
  - wordpress
---
  
git是現在常見的distributed revision control以及source code management system，詳細介紹可以參考[維基百科](http://zh.wikipedia.org/wiki/Git)的說明。  
本篇簡單介紹一些入門以及常用的git指令，也可以參考GitHub和Code School共同提供的[Try Git教學課程](http://try.github.io/)。  
  

- 起始一個git repository

- git init

- 檢查git repository的目前(commit/push)狀態

- git status

- 新增commit檔案

- git add \[檔案\]

- 刪除commit檔案

- git rm \[檔案\]

- commit檔案並附上註解

- git commit -m "\[commit註解\]"

- 查看commit歷史紀錄

- git log

- remote遠端檔案

- git remote add \[repository名稱\] \[repository網址\]

- repository操作

- git push -u \[repository名稱\] \[branch名稱\]

- \-u 記住這次參數設定，下次只要git push即可

- git pull \[repository名稱\] \[branch名稱\]

- 回復版本

- git checkout --\[目標檔案\]

先暫時筆記到此，之後再慢慢增加
