---
title: "Install zsh / oh-my-zsh on Ubuntu"
date: "2013-06-25"
---

# Install zsh / oh-my-zsh on Ubuntu

zsh是個很酷的shell，提供高度可自訂化的shell環境，更多詳細訊息請見 [zsh官方網站](http://www.zsh.org/)

本篇筆記如何在Ubuntu環境安裝zsh，並使用oh-my-zsh客製化zsh環境，部分指令與OS X上有些許出入，OS X的安裝請見 [oh my zsh Github](https://github.com/robbyrussell/oh-my-zsh)

原始教學參考自 [AJ ONeal的YouTube教學影片](http://www.youtube.com/watch?v=1S3MUVIAieE)

[Dim Powerline Theme by Howar31](https://gitlab.com/howar31/oh-my-zsh-powerline-theme)

## Requirement

1. Ubuntu _本篇測試環境Ubuntu Server 12.10_
2. bash 基本知識
    - 例如 `pushd`、`popd`、`apt-get` 等等
3. vim 基本知識 _或其它類似文字編輯器_

## Installation

### ZSH

`sudo apt-get update && sudo apt-get install -y curl vim git zsh`

上述指令做了五件事:

1. 更新apt-get
2. 安裝curl
3. 安裝vim
4. 安裝git
5. **安裝zsh**

除了zsh是核心之外，其它是在等等過程中會用到的工具，如果系統中原本就已經安裝最新版，則會自動跳過

### Oh My ZSH

一行指令就能裝好

`curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | bash`

_很多網站指令後面寫`sh`，但Ubuntu要改成`bash`_

### Setting Default Shell

將zsh設定為目前使用者的預設shell

`sudo chsh -s $(which zsh) $(whoami)`

> $(which zsh) 表示找到zsh的位置
> 
> $(whoami) 表示目前使用者

設定好後，可以手動到`home`的`.bashrc`看是否設定成功

## Configure ZSH by Oh My ZSH

修改`home`的`.zshrc`即可

`vim ~/.zshrc`

佈景主題修改`ZSH_THEME="theme_name"`

佈景主題位置在`.oh-my-zsh/themes/`底下

[oh-my-zsh Theme Wiki](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes)

* * *

> Written with [StackEdit](http://benweet.github.io/stackedit/).
