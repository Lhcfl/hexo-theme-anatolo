---
title: Anatolo教程
date: 2023-10-13 15:05:47
tags:
  - Anatolo Tutorial
toc: true
---

欢迎使用Anatolo。本教程将教您Anatolo的所有可配置项目。

## 安装，配置与更新

### 下载主题文件

#### 通过 GitHub

进入你的 Hexo Blog 根目录:

``` 
git clone https://gitee.com/Lhcfl/hexo-theme-anatolo.git themes/Anatolo
```

#### 通过 Gitee 镜像

<div class="tip">
Due to the special network environment in mainland China, GitHub is often unavailable. The mirror and local download methods are prepared for people living in mainland China. For others, this part can be ignored safely.
</div>

进入你的 Hexo Blog 根目录:

``` 
git clone https://gitee.com/Lhcfl/hexo-theme-anatolo themes/Anatolo
```

#### 通过本地安装

本地安装不支持通过Github更新。  
直接下载该主题的zip包解压至主题目录下，重命名为 `Anatolo` 

### 安装依赖

```
npm install hexo-renderer-pug --save
npm install hexo-renderer-stylus --save
```

### 配置

复制 `themes/Anatolo` 下的 `_config.example.yml` ，粘贴为 `_config.yml`  
修改hexo根目录下的 `_config.yml` ： `theme: Anatolo`


### 更新

在Anatolo的目录下

```
git pull origin master
```

## 配置文件详解

本部分提供对 `config.yml` 的中文解释。

这是默认的 `config.example.yml`

```yaml

# 这片区域是博客的设置
# 这是网站的关键词
keywords: Blog,博客,Hexo
# 作者名
author: Yourname
# 网站描述
description: A simple and beautiful blog
# 默认配色方案
defaultTheme: light-mode # light-mode or dark-mode

# 网站图标。
# 如果你认为网站图标的大小不够好看，去调整 /source/css/style.styl
favicon: /images/favicon.webp
avatar: /images/logo.webp
logo_dir: /images/logo@2x.webp
logo_style: width:220px;

# 这是全站的版权声明设置
copyright:
  # 如果 show 被设置为 true，你的每篇博文都会显示一个版权声明。但你也可以在每篇文章的头部单独设置版权声明：
  # 例如: 
  # ---
  # title: xxx
  # copyright: "All rights reserved"
  # author: "Li Hua and Han Meimei"
  # ---
  # 也可以对某篇文章取消版权声明：
  # ---
  # title: xxx
  # copyright: disabled
  # ---
  show: true
  # 版权声明的默认文字
  default: "本文采用CC-BY-SA-3.0协议，转载请注明出处"
  # 在
  show_author: true

# 站点侧边栏底部
footbar:
  # 本意是用作描述Copyright的，不过你也可以改成
  copyright: 全站CC-BY-SA-3.0
  # 对于中国用户，如果你有网站备案：
  beian: 
  gongan: 


# 社交链接
# 你可以去 social_links.pug 增加更多的
github: https://github.com/Lhcfl
mail: yourname@example.com
zhihu: 
QQ: 
twitter:
instagram:
rss:
facebook:
weibo:

# 导航栏设置
menu:
  Home: /
  Archives: /archives
  Tags: /tags
  About: /about
  Links: /links

# 导航栏右边的按钮
rightbtn:
  back: true            # 显示后退按钮
  search: true          # 显示搜索按钮
  avatar: true          # 显示头像
  darkLightToggle: true # 显示暗色/亮色主题切换


# 其他设置
useSummary: false       # 打开它之后，文章会使用自动生成的概要，而不是你在文章中人工规定的 <!-- more -->

useTagCloud: false      # 使用标签云
tocMaxDepth: 6          # 目录的最高层级。设为0禁用目录。


  
# 评论
always_enable_comments: false # 无视文章的comments设置，总是允许评论

duoshuo: 
disqus: 
gentie: 
# Valine comments https://valine.js.org
valine:
  enable: false # if you want use valine, please set enable: true
  appid:  # your leancloud appid
  appkey:  # your leancloud appkey
  notify: false # true/false:mail notify !!!Test,Caution. https://github.com/xCss/Valine/wiki/Valine-%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F%E4%B8%AD%E7%9A%84%E9%82%AE%E4%BB%B6%E6%8F%90%E9%86%92%E8%AE%BE%E7%BD%AE
  verify: false # true/false:verify code
  avatar: mm # avatar style https://github.com/xCss/Valine/wiki/avatar-setting-for-valine
  placeholder: hello, world # comment box placeholder
gitment:
  enable: false
  owner: 'Your GitHub ID'
  repo: 'Repo to store comments'
  client_id: 'Your client ID'
  client_secret: 'Your client secret'
gitalk:
  enable: false
  owner: 'Your GitHub ID'
  repo: 'Repo to store comments'
  client_id: 'Your client ID'
  client_secret: 'Your client secret'

# 百度统计设置
# 请访问 https://tongji.baidu.com/ 
# 获取统计JS代码放入 Anatolo/source/js/baidu-tongji.js
Baidutongji: false

```

## 对每篇文章允许的设置

举例，如果你有一篇文章， `hello world.md`，它顶上应该有长这样的元信息：

```yaml
---
title: Hello World
date: 2023-10-13 15:05:47
tags:
  - tag1
  - tag2
toc: true
title: xxx
summary: "hello? world!"
copyright: "All rights reserved"
author: "无名氏"
---
```

### 目录

在元信息中添加 `toc: true` 在页面上启用目录

### 文章摘要

如果你在元信息中添加 `summary`，则 Anatolo 会使用你提供的 summary 来生成首页的文章摘要。

### 友链

在你的Markdown中添加像这样的HTML

```html
<div
  class="friend-link"
  avatar="https://头像所在的网址"
  href="https://友链地址"
  title="友链标题"
  description="友链描述"
></div>
```

来声明一条友链。友链会在访问网站时被动态展开：


```js
// Anatolo/source/js/utils/friends-link-generator.js
`<div class="friend-link-container"><div class="friend-link-box">
  <aside class="friend-link-avatar">
    <img src="${escapeHTML(avatar)}" href="${escapeHTML(href)}">
  </aside>
  <div class="friend-link-meta">
    <div class="friend-link-title">
      <a href="${escapeHTML(href)}">${escapeHTML(title)}</a>
    </div>
    <div class="friend-link-description">
      ${escapeHTML(description)}
    </div>
  </div>
</div></div>`;
```

`avatar` `href` `title` `description` 分别是 友链头像、友链地址、友链标题、友链描述。

### Copyright与作者

```
copyright: "All rights reserved"
author: "无名氏"
```

`copyright` 是必填项，设置你的文章底下显示的版权声明是什么。如果你在主题配置中启用了默认显示Copyright，则将 `copyright` 设置成 `disabled` 就可以不显示了。你也可以直接填写空字符串 `""`

`author` 是选择性的，设置你的文章的作者是谁。

## 特殊样式

在写文章的时候，你可以加入tip框

```html
<div class="tip">
Tip框内的文字
</div>
```

渲染出来会有这样的样式：

<div class="tip">
Tip框内的文字
</div>
