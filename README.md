# hexo-theme-Anatolo

[实时更新自动demo](https://lhcfl.github.io/Anatolodemo)

[博客样例（作者博客）](https://lhcfl.github.io)

[国内镜像](https://gitee.com/Lhcfl/hexo-theme-anatolo)

- [主题文档 中文](https://lhcfl.github.io/Anatolodemo/2023/10/13/Anatolo%E6%95%99%E7%A8%8B/)
- [Documentation English](https://lhcfl.github.io/Anatolodemo/2023/10/13/Anatolo%20Tutorial/)

## 关于主题

基于ben02的[Anatole主题](https://github.com/Ben02/hexo-theme-Anatole)进行了大量修改，增添和优化。  

搜索框代码来自主题Icarus。二主题都采用MIT License，故本主题也采用之。  
部分代码参考了Anatole-core

Anatolo设计极致简约，但麻雀虽小，五脏理应俱全。因此，我在[Anatole主题](https://github.com/Ben02/hexo-theme-Anatole)基础上增加了动态请求、帖子目录、黑暗模式、搜索框等多种理应有的功能，并对界面进行了进一步美化，只为让它甄于完美。

如果有任何建议欢迎issue，也可以提出pr。如果对本主题有任何疑问，您也可以发送邮件给我： lhcfl@outlook.com

## 使用方式
参见 https://github.com/Lhcfl/hexo-theme-anatolo/wiki

## Todo List

- 使用基于json的Ajax
- 点击头像弹出的菜单没有动画且过于隐蔽


## 改进
- 我在学世界语所以主题改名为Anatolo（
- 暗黑模式支持
- 增加了文章概要的选项
- 增加了多语言支持
- 增加了可选的搜索框
- 增加了可选的标签页和标签云
- 增加了可选的目录（toc）支持和深度调整
- 调整了部分选项的可选性
- 增加了nav menu的编辑支持
- 增加了文章底部的copyright栏
- 增加了文章的字数统计
- 增加了部分社交账号支持
- 增加了显示网站备案号功能和百度统计
- 增加了Gitalk评论支持
- 使用Ajax来切换页面，减少加载的视觉噪音
- 移动端自动scroll页面，防止过多纠结于头像
- 允许自动化生成友链

## 已知bug ~~（feature）~~
- 原主题的葡萄牙语支持无法更新
- TOC放置可能不够美观
- 当Nav栏放置过多链接时可能导致右侧按钮下移
- ~~目前暗黑模式尚未适配评论区，会导致评论区割裂~~ 已完成对GitTalk的支持，其余我不打算支持了，如有需求请自行PR

## 使用


### 安装

Clone:

``` 
git clone https://gitee.com/Lhcfl/hexo-theme-anatolo.git themes/Anatolo

或者直接下载主题zip包解压至主题目录下，重命名为Anatolo

```

安装依赖

```
npm install hexo-renderer-pug --save
npm install hexo-renderer-stylus --save

```

### 配置
复制`_config.example.yml`为`_config.yml`  
修改hexo根目录下的 `_config.yml` ： `theme: Anatolo`


### 更新
在Anatolo的目录下
```
git pull origin master

```


