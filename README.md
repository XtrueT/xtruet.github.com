---
layout: post
title: README
---

# [博客地址](https://xtruet.github.io)

## 开始

参见[这篇博文](https://wu-kan.github.io/posts/博客搭建/基于Jekyll搭建个人博客)

## 声明

除特别声明或转载外，所有博文采用[署名-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)协议进行许可。


## 致谢

参见[这篇博文](https://wu-kan.github.io/posts/博客搭建/基于Jekyll搭建个人博客) wu-kan.github.com， 感谢。

托管于[Github Pages](https://pages.github.com/)，感谢。

由[jekyll/jekyll](https://github.com/jekyll/jekyll)驱动，感谢。

[A cross-browser library of CSS animations. As easy to use as an easy thing.](http://daneden.github.io/animate.css) 
使用了[jsdelivr](https://www.jsdelivr.com/)提供的CDN加速服务，感谢。

使用了[bootcdn](https://www.bootcdn.cn/)提供的CDN加速服务，感谢。

留言和阅读量系统基于[Valine](https://valine.js.org/)和[LeanCloud](https://leancloud.cn/)，感谢。

博文目录插件在[ghiculescu/jekyll-table-of-contents](https://github.com/ghiculescu/jekyll-table-of-contents)基础上修改，感谢。

博客搜索插件使用了[christian-fei/Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)，感谢。

代码高亮及插件使用了[PrismJS](https://prismjs.com/)，感谢。


## 功能

- [x] 完成博客文章标签页
- [x] 加入评论系统，暂时考虑用valine+leancloud实现
  - [x] 基于valine的阅读量统计
- [x] 加入不蒜子统计
- [x] <i class="fab fa-font-awesome"></i> Font Awesome
- [x] 全站搜索
- [x] 调整代码块风格，并加上代码选中按钮
- [x] 返回顶部实现
- [x] 加入可以自动展开、标号的目录
  - [x] 目录标号
  - [x] 自动展开
- [ ] 界面
  - [x] 首页整改
  - [x] 文章分页
  - [ ] 引入每日必应图作为网页背景图 ps： 太慢了已经删除
  - [x] 添加动画效果
  - [x] 添加标签筛选功能

## 历程

### 正在进行 v3.0.6

#### TodoList

- [ ] 根据报告完善性能和辅助功能
- [ ] 原生重写目录插件修改样式使之可以在多设备上使用
- [x] 统一 js 和 图标 
- [x] 界面调整
  - [x] sidebar微调
  - [x] sidebar搜索分离
  - [x] 首页整改
  - [x] 文章分页
  - [ ] 引入每日必应图作为网页背景图
  - [x] 统计每个Tag 的文章数
  - [x] 添加个人信息页面

#### 已知bug

- 其他的一些浏览器兼容问题

### 2019-12-06 v3.0.5
- 修改为极简版
- 加快渲染速度
- 添加部分无障碍属性

### 2019-11-01 v3.0.4

- 简单支持PWA
- 使用lighthouse分析博客，[查看分析报告](https://xtruet.github.io//report.html)

### 2019-09-25 v3.0.3

- 添加标签筛选功能

### 2019-09-22 v3.0.2

- 整合js和css
- 修复导航闪动
- icon统一


### 2019-09-13 v3.0.1

- 添加标签分类统计
- 添加标签页面筛选功能
- 添加小图标
- 修复prism js 代码添加行数失效

### 2019-09-13 v3.0.0

- 更换模版
- 修改目录
- 修改搜索

### 2019-08-28 v2.0.3

- window.onscroll 不触发的原因和解决
- 并且出现 onscroll 事件不触发的情况是html和body同时设置{overflow:auto;height:100%}导致的,两句css代码是冲突的，

### 2019-08-28 v2.0.2

- 引入背景图
- 透明UI （css属性）

### 2019-08-28 v2.0.1

- 修复生成目录失效的问题
- 引入脚本在组件脚本之后导致组件脚本失效

### 2019-08-28 v2.0.0

- 重构完成

### 2019-08-28 v1.0.1

- 学习使用模版
- 重构项目

### 2019-08-27 v1.0.0

- 在Github上成功部署博客

