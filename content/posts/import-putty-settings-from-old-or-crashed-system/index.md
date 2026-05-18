---
title: "Import Putty Settings from Old or Crashed System"
date: "2013-12-24"
categories:
  - wordpress
---

> Reference: [Putty: Import settings from old HDD or crashed system](http://www.miniservernation.com/2012/05/putty-import-settings-from-old-hdd-or-crashed-system/)

Putty只有單一一個exe檔即可執行，不需要外掛dll等附加檔案，但是Putty的設定檔卻都存在Windows的登錄檔(Registry)裡面，不但造成可攜性(portability)降低、也讓系統損毀或更換時轉移設定的麻煩。

一般轉移Putty設定檔，只匯出匯入登錄檔即可，但如果發生硬碟故障或系統損毀，造成舊系統無法開機，這時候要拿設定檔就沒辦法直接操作。本篇步驟可幫助你在無法啟動舊系統的情況下，直接從新系統撈回Putty設定檔！

## 適用條件

- 系統或硬碟損毀，但狀況輕微或有備份，仍可存取資料
- 舊系統登錄檔檔案(NTUSER.DAT)仍然完整可存取

## 救援步驟

以下步驟需按照順序不可跳過或省略

1. 在新系統上先執行一次Putty，讓Putty在新系統的Registry內建立entry
2. 關閉Putty
3. 點選「開始_(Start)_」>「執行_(Run)_」(Win + R)，輸入「regedit」開啟登錄檔編輯器(Registry Editor)
4. 登錄檔編輯器左邊，點選「HKEY\_LOCAL\_MACHINE」
5. 點選「檔案_(File)_」>「載入 Hive 控制檔_(Load Hive)_」
6. 接下來需要找到舊系統登錄檔的位置，請到舊的使用者設定資料夾內，例如: `D:\Users\myusername\NTUSER.DAT`

> 注意，這邊如果找不到檔案，先檢查是否有開啟顯示隱藏系統檔:  
> 1\. 開啟「我的電腦_(My Computer)_」  
> 2\. 工具列點選「工具_(Tools)_」>「資料夾選項_(Folder Options)_」  
> 3\. 標籤「檢視_(View)_」>「進階設定_(Advanced Settings)_」  
> 4\. **不要**勾選「隱藏保護的系統檔案_(Hide protected operating system files)_」  
> 5\. 按「確定_(OK)_」後即可  
> 如果這邊找不到或無法存取NTUSER.DAT可能就沒救了

1. 找到檔案後點選，會跳出一個詢問對話框，要求輸入一個名字，例如: `old-registry`
2. 現在在「HKEY\_LOCAL\_MACHINE」底下可以看到剛剛新增的entry `old-registry`
3. 展開 `HKEY_LOCAL_MACHINE\old-registry\Software\SimonTatham`
4. 右鍵點選「SimonTatham」選擇「匯出_(Export)_」
5. 選擇匯出存檔位置與名稱，例如: `putty-config.reg`
6. 剛剛的 `old-registry` 已經用不到了，點選 `old-registry` ，**注意務必要選對 `old-registry`** ，然後選「檔案_(File)_」>「卸除 Hive 控制檔_(Unload Hive)_」
7. 成功卸載後，關閉登錄檔編輯器_(Registry Editor)_
8. 找到剛剛匯出的登錄檔 `putty-config.reg` ，按右鍵「編輯_(Edit)_」，用記事本(或文字編輯器)開啟
9. 將所有「HKEY\_LOCAL\_MACHINE\\old-registry」取代為「HKEY\_CURRENT\_USER」
10. 儲存檔案並關閉 `putty-config.reg`
11. 點兩下 `putty-config.reg` 跳出登錄檔合併確認視窗，點選確定開始合併
12. 合併成功後，開啟Putty就會發現舊的設定檔都回來了！

## 後記

Putty用Registry存設定真的很麻煩，所以也有網友自行重新編譯Putty，將存檔機制重寫，讓Putty的設定改存在一個檔案中，如果有需要可以參考使用: [PuTTY for win32 storing configuration into file](http://jakub.kotrla.net/putty/)

> Written with [StackEdit](https://stackedit.io/).
