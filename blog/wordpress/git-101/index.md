---
title: "Git 101 基礎入門"
date: "2013-09-06"
---

# Git 101 基礎入門

## Git起源

Git是一種著重於速度的[Version Control System](http://en.wikipedia.org/wiki/Distributed_version_control)和[Source Code Management System](http://en.wikipedia.org/wiki/Source_code_management)，最初是由[Linux Torvalds](http://en.wikipedia.org/wiki/Linus_Torvalds)為了維護[Linux Kernel](http://en.wikipedia.org/wiki/Linux_kernel)而在2005年創建的。

## Git特色

Git基於維護[Linux Kernel](http://en.wikipedia.org/wiki/Linux_kernel)這樣大型專案的需求與經驗，以及一些File System的概念而誕生，其著重的特色:

1. Non-linear Development
2. Distributed Development
3. Compatibility with existing systems/protocols
4. Efficient handling of large projects
5. Cryptographic authentication of history
6. Toolkit-based design
7. Pluggable merge strategies
8. Garbage accumulates unless collected
9. Periodic explicit object packing

## Git基本指令

- `git init`
    - 起始一個git repository
- `git status`
    - 檢查git repository的目前(commit/push)狀態
- `git add [檔案]`
    - 新增commit檔案
- `git rm [檔案]`
    - 刪除commit檔案
- `git commit -m “[commit註解]“`
    - commit檔案並附上註解
- `git log`
    - 查看commit歷史紀錄
- `git remote add [repository名稱] [repository網址]`
    - 新增remote repository
- `git remote -v`
    - 列出目前設定的remote
- `git push -u [repository名稱] [branch名稱]`
    - 推送檔案到remote repository上
    - \-u 記住這次參數設定，下次只要git push即可
- `git pull [repository名稱] [branch名稱]`
    - 從remote repository上拉檔案下來
- `git diff HEAD`
    - 比較檔案差異，最新的commit指標為HEAD
- `git checkout –[目標檔案]`
    - 回復版本
- `git branch [branch名稱]`
    - 開新分支
- `git branch -d [branch名稱]`
    - 刪除分支
- `git checkout [branch名稱]`
    - 切換分支
- `git merge [來源branch]`
    - 合併分支

## Git練習

這邊有互動式的線上模擬git練習，方便初學理解概念與操作方法

- [http://try.github.io/](http://try.github.io/)
- [http://pcottle.github.io/learnGitBranching/](http://pcottle.github.io/learnGitBranching/)

## 參考資料

- [http://git-scm.com/](http://git-scm.com/)
- [https://github.s3.amazonaws.com/media/progit.en.pdf](https://github.s3.amazonaws.com/media/progit.en.pdf)
- [http://en.wikipedia.org/wiki/Git\_(software)](http://en.wikipedia.org/wiki/Git_(software))

> 本篇投影片網址 [http://www.slideshare.net/howar31/git-101-25940669](http://www.slideshare.net/howar31/git-101-25940669)
> 
> Written with [StackEdit](http://benweet.github.io/stackedit/).
