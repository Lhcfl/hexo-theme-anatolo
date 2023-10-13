---
title: Anatolo设置教程
date: 2023-10-13 15:05:47
tags:
  - Anatolo设置教程
toc: true
---

欢迎使用Anatolo。本教程将教您Anatolo的所有可配置项目。

Welcome to user Anatolo. This tutorial will teach you all of Anatolo's configurable items.

## 安装，配置与更新 | Install, configure and update

### 下载主题文件 | Download theme asserts

#### 通过 GitHub | By Github

进入你的 Hexo Blog 根目录:

Enter your root path of Hexo blog:

``` 
git clone https://gitee.com/Lhcfl/hexo-theme-anatolo.git themes/Anatolo
```

#### 通过 Gitee 镜像 | By Gitee mirror

<div class="tip">
Due to the special network environment in mainland China, GitHub is often unavailable. The mirror and local download methods are prepared for people living in mainland China. For others, this part can be ignored safely.
</div>

进入你的 Hexo Blog 根目录:

``` 
git clone https://gitee.com/Lhcfl/hexo-theme-anatolo themes/Anatolo
```

#### 通过本地安装 | Local methods

本地安装不支持通过Github更新。  
直接下载该主题的zip包解压至主题目录下，重命名为 `Anatolo` 

Local installations do not support upgrade via Github.  
Just directly download the zip package of the theme, unzip it to the theme directory, and rename it to `Anatolo`.

### 安装依赖 | Install dependencies

```
npm install hexo-renderer-pug --save
npm install hexo-renderer-stylus --save
```

### 配置 | Configure

复制 `themes/Anatolo` 下的 `_config.example.yml` ，粘贴为 `_config.yml`  
修改hexo根目录下的 `_config.yml` ： `theme: Anatolo`

Copy `_config.example.yml` in `themes/Anatolo` to `_config.yml`  
Modify `_config.yml` in the hexo root directory: `theme: Anatolo`

### 更新 | Upgrade

在Anatolo的目录下

In the Anatolo root directory:

```
git pull origin master
```

