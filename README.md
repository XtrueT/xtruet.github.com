# XtrueT.github.com

## 开始

参见[这篇博文](https://wu-kan.github.io/posts/博客搭建/基于Jekyll搭建个人博客)

## 声明

除特别声明或转载外，所有博文采用[署名-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)协议进行许可。

博客基于[MIT License](https://github.com/wu-kan/wu-kan.github.io/blob/master/LICENSE)开源于[GitHub](https://github.com/wu-kan/wu-kan.github.io)。

## 致谢

参见[这篇博文](https://wu-kan.github.io/posts/博客搭建/基于Jekyll搭建个人博客) wu-kan.github.com， 感谢。

托管于[Github Pages](https://pages.github.com/)，感谢。

由[jekyll/jekyll](https://github.com/jekyll/jekyll)驱动，感谢。

基于[poole/lanyon](https://github.com/poole/lanyon)主题进行修改，感谢。

使用了[jsdelivr](https://www.jsdelivr.com/)提供的CDN加速服务，感谢。

使用了[<i class="fab fa-font-awesome"></i>fontawesome-free](https://fontawesome.com/)提供的免费图标库，感谢。

留言和阅读量系统基于[Valine](https://valine.js.org/)和[LeanCloud](https://leancloud.cn/)，感谢。

使用了[不蒜子](http://busuanzi.ibruce.info/)页面统计，感谢。

博文目录插件在[ghiculescu/jekyll-table-of-contents](https://github.com/ghiculescu/jekyll-table-of-contents)基础上修改，感谢。

博客搜索插件使用了[christian-fei/Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)，感谢。

代码高亮及插件使用了[PrismJS](https://prismjs.com/)，感谢。

Live2D基于[stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)，感谢。

使用了[leopardpan/leopardpan.github.io](https://github.com/leopardpan/leopardpan.github.io)的头像翻转效果，感谢。

## 功能

- [x] 完成博客文章标签页
- [ ] 完成博客文章分类页（分类暂时和标签没区别）
- [ ] 重写博客首页，做一个有意思的封面，不再显示文章
- [x] 加入评论系统，暂时考虑用valine+leancloud实现
  - [x] 基于valine的阅读量统计
- [x] 加入不蒜子统计
- [x] <i class="fab fa-font-awesome"></i> Font Awesome
- [x] 全站搜索
- [] 移植[原博客的ribbon动态背景](https://github.com/theme-next/theme-next-canvas-ribbon)
- [x] 调整代码块风格，并加上代码选中按钮
- [x] 加入可以自动展开、标号的目录
  - [x] 目录标号
  - [ ] 自动展开
- [ ] mermaid
  - [ ] Markdown代码扩展
- [ ] $\KaTeX$
- [ ] Live2D
  - [ ] 加上切换Live2D显示/关闭的按钮
  - [ ] 使用自己搭建的Live2D后端API
    - [ ] 收集一些Live2D Model

## 历程

### 正在进行 v2.0.1

#### TodoList

- [ ] 所有脚本和插件JSLoader化，增加移植性和访问速度
  - [ ] katex
  - [ ] mermaid
  - [x] baidu_push
  - [ ] prismjs
- [x] 升级fontaswsomev4.7.0至fontawesome-freev5.10.1，支持的图标数量由675增加至1535
- [x] 界面调整
  - [ ] 正文部分增加背景，从而减少动态ribbon背景的阅读体验
  - [x] sidebar微调
  - [x] sidebar搜索分离

#### 已知bug

- 配置选项body.overlay失效，正文不跟随侧边栏移动。产生原因是在page中为了加快页面内容显示，将正文移动至sidebar上面
- fontaswsome的rss图标和rss-square图标均失效，暂时去掉博客页面中的rss图标

### 2019-08-28 v2.0.0

- 重构完成

### 2019-08-28 v1.0.1

- 学习使用模版
- 重构项目

### 2019-08-27 v1.0.0

- 在Github上成功部署博客

