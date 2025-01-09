# hexo-theme-Anatolo

[实时更新自动demo](https://lhcfl.github.io/Anatolodemo)

[主题文档 Theme document](https://lhcfl.github.io/Anatolodemo/tags/Anatolo-Tutorial/)

> [!warning]
> This theme has entered maintainance mode
> 该主题已经进入 maintainance mode，这意味着除了修复 bug 之外，不会对该主题进行大范围的修改和新功能的添加。

## 关于主题

基于ben02移植的[Anatole主题](https://github.com/Ben02/hexo-theme-Anatole)进行了前端重构。

现在，Anatolo已经是一个类型安全的小巧现代化 Hexo 主题。Anatolo 前端的 js 文件仅仅只有不到 40KB 大小，保证极快的加载速度。

Anatolo 还在[Anatole主题](https://github.com/Ben02/hexo-theme-Anatole)基础上增加了动态请求、帖子目录、黑暗模式、搜索框等多种理应有的功能，并对界面进行了进一步美化。

### 鸣谢

搜索框代码大量参考了 [Icarus](https://github.com/ppoffice/hexo-theme-icarus) 的工作

码云功能和一些中国特色功能来自 [Anatole-core](https://github.com/mrcore/hexo-theme-Anatole-Core)

## 改进

- 引入了现代化前端打包器 Rollup.js, Typescript 与 TSX
- 暗黑模式支持
- 增加了文章概要的选项
- 增加了多语言支持
- 增加了可选的搜索框，依赖Fuse.js允许模糊搜索
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

## Won't fix

- 暗黑模式的评论区只对 Gittalk 有支持，如有需要请自行PR

## 使用

### 安装

克隆本仓库并安装依赖：

```bash
git clone https://github.com/Lhcfl/hexo-theme-anatolo.git themes/Anatolo
cd themes/Anatolo
pnpm i # 必须安装依赖
```

在hexo博客根目录：

```
npm install hexo-renderer-pug --save
```

### 配置

复制`_config.example.yml`为`_config.yml`  
修改hexo根目录下的 `_config.yml` ： `theme: Anatolo`

### 更新、

在Anatolo的目录下

```bash
git pull origin master
```

## 开发

### 准备工作

进入Anatolo的目录，执行

```bash
pnpm i
```

安装所有依赖。

### 目录结构

- `.github`: GitHub 的 CI 配置文件，用于自动部署样例
- `includes`: 主题内置的 Hexo 脚本
- `languages`: I18n 文件
- `layout` 主题使用的模板，在服务端（也就是 `hexo g`）渲染成最后的 HTML
- `scripts`: 主题内置的 Hexo 脚本
- `source`: 主题需要的HTML资产
- `src`: 主题前端相关的 typescript 脚本。这些脚本会被 `rollup` 打包并压缩成一个 `js/complied/bundle.js`

### 代码格式化

对本主题做出修改后，使用下面的命令可以对代码进行格式化

```bash
pnpm format
```

详见 `package.json`
