---
title: "Linux Screen"
date: "2013-12-02"
categories:
  - wordpress
---

**screen** 是在Linux上用來做window或session管理的指令，可以用單一實體terminal模擬多個sessions同時多工執行

## 常用指令

- `screen -dmS <session_name>`
    - `-dm` 啟用screen並指定起始狀態為detach mode，會建立一個新的session但不會attach，特別適合用於system startup script
    - `-S` 指定session名稱
- `screen -r <pid_tty_host>`
    - `-r` reattach一個session
    - `-R` reattach一個session，若session不存在則先建立session
- `screen -d <pid_tty_host>`
    - `-d` detatch一個已經在遠端attach的session，當session已經在別的地方attach時，必須先detach才能reattach
    - `-D` detatch並logout一個遠端的session
- `screen -DR <pid_tty_host>`
    - 如果session存在，則reattach
    - 如果session在遠端已經attach，則detatch並logout
    - 如果session不存在，則建立新的session
- `screen -ls`
    - 列出目前所有screen的pid.tty.host

## 組合按鍵

已經在screen中，使用組合按鍵操作screen，所有screen的組合按鍵都由`Ctrl+A`開始(後記為`C-a`)，為了操作方便，所有**小寫**的快速鍵，加上`Ctrl`一樣可以運作，例如，`C-a c`等同於`C-a C-c`

- 資訊
    - `C-a ?` 顯示快速鍵幫助
    - `C-a "` 列出所有window列表
    - `C-a w` 顯示window簡單列表
    - `C-a *` 顯示session attach資訊列表
    - `C-a i` 顯示目前window資訊
- 切換window
    - `C-a '` 輸入數字或window name跳轉window
    - `C-a [0~9]` 直接跳轉到0~9的window
    - `C-a C-a` 切換到上一個window
- Window操作
    - `C-a c` 建立新的window
    - `C-a d` detatch目前的screen
    - `C-a k` 銷毀目前window
    - `C-a space`或`C-a n` 切換到下一個window
- 分割視窗
    - `C-a S` 水平分割window
    - `C-a |` 垂直分割window
    - `C-a tab` 在分割之間切換focus
    - `C-a X` 關閉目前分割
    - `C-a Q` 關閉所有分割，但保留目前使用的
- 其他
    - `C-a C-g` 切換visual bell模式，用螢幕閃爍或喇叭聲響表示bell
    - `C-a x` 鎖住terminal
    - `C-a :` 進入command line模式

## Command Line

使用`C-a :`進入command line模式，可以進行進階設定

- `encoding [enc]` 設定screen如何編碼input/output
    - \[enc\]: eucJP, SJIS, eucKR, eucCN, Big5, GBK, KOI8-R, CP1251, UTF-8, ISO8859-2, ISO8859-3, ISO8859-4, ISO8859-5, ISO8859-6, ISO8859-7, ISO8859-8, ISO8859-9, ISO8859-10, ISO8859-15, jis.
- `title [windowtitle]` 設定目前window的title為\[windowtitle\]

## 其他

更多screen操作方式請見`man screen`

> Written with [StackEdit](https://stackedit.io/).
