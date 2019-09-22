---
layout: post
title: Vue-Router基础使用
date: 2019-09-15
author: 霁
header-img:
catalog: true
categories:
- 学习
- Vue
tags:
- Vue
---

## Vue-Router

[官方文档](https://router.vuejs.org/zh/)

### 项目结构

根据自带的vue-cli3选择添加vue-router生成的结构

![1568853800261](F:/post_图片/1568853800261.png)

![1568853848375](F:/post_图片/1568853848375.png)

![1568853972863](F:/post_图片/1568853972863.png)

### 声明式的路由使用

```html
使用
<router-link to="/">Home</router-link>
进行导航,默认被渲染成一个<a></a>标签
<a href="home">Home</a>

to = "字符串|{一个对象}"
可以被动态绑定
属性指定链接,表示目标路由的链接
内如会把to的值传到router.push()

replace
当设置时,to调用的是router.replace()
替换当前的导航不会留下导航的history记录

append
当设置时,则在当前相对路径前添加根路径
不设置：/home-->/about
设置：/home-->/home/about

tag
指定<router-link/>渲染的标签
默认是<a></a>
指定为 tag="li"
将渲染为<li></li>

active-class
设置链接被激活时的css类名
默认
class ="router-link-active"

exact-active-class
设置精确匹配时的css类名
默认
class = "router-link-exact-active"

event = "比如mouseover"
字符串|[字符串]
声明触发导航的事件

与路由匹配的组件会渲染到
<router-view></router-view>

```

#### 关于active-class 和exact-active-class的区别

router-link 默认是模糊匹配，匹配成功自动添加

active-class：".router-link-active"

只有当路由路径全匹配时才添加

exact-active-class的class

例如：/home 和 /home/user 都会被active-class 

但是加上exact-active-class只有被全匹配才active 



#### router.js 和main.js

基于模块化编程，router.js是包括路由的映射配置，配置好路由表然后导出一个router对象给main.js调用。

```javascript
// router.js
//1.导入Vue 和 Router
import Vue from 'vue'
import Router from 'vue-router'
//2.导入组件
import Home from './views/Home.vue'
//3.调用路由模块
Vue.use(Router)
//4.暴露出一个router对象
export default new Router({
//5.进行路由表的配置
    mode: 'history',//指定模式，使用HTML5的history api除此还有hash模式 
	base: process.env.BASE_URL, // 设置基准url
	routes: [ // 配置路由
    // 一个路由应该对应一个组件
	{    
	path: '/',//设置对应路径
	name: 'home',//命名路由
	component: Home//对应组件
	},
	{
	path: '/about',
	name: 'about',
	// route level code-splitting
	// this generates a separate 
    //chunk (about.[hash].js) for this route
	// which is lazy-loaded when the route is visited.
	component: () => import(/* webpackChunkName: "about" */ 				'./views/About.vue')
	},
]
})
//6.最后进行创建和挂载根实例

```

```javascript
// main.js
// 导入Vue 和需要的模块
import Vue from 'vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
// 导入根组件
import App from './App.vue'

Vue.config.productionTip = false
// 创建和挂载
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

通过注入路由器，可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由，我们使用 `this.$router` 的原因是我们并不想在每个独立需要封装路由的组件中都导入路由.

### 路由属性配置

```javascript
关于动态路由更多的其他属性   
指定动态路径：/about/:username
username被设置到
参数列表：
this.$route.params

/search?username="xxx"
username被设置到
查询列表：
this.$route.query

/home # username
username被设置到
hash列表：
this.$route.hash

在组件里使用
$.route.params.username
$.route.query.username
$.route.hash.username

// 关于通配符
{
// 匹配所有路径
path:'*'
// 匹配以user-开头的任意路径
path:'user-*'    
}
存在路径/user-admin
admin被匹配
此时{pathMatch:admin}会被添加到params列表
```

#### 关于匹配优先级

同一个路径匹配多个路由，谁先定义，谁优先

#### 嵌套路由

```javascript
// 在<router-view/>渲染的组件里再定义一个<router-view/>来渲染匹配的子路由
// 在嵌套出口组件也就是子<router-view/>所在的组件
// 定义
children:[] // 属性以定义嵌套的路由表
// 比如：
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '',(空的子路由渲染一个对应的组件)
         component: UserHome 
        },
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',//(user/:id/profile)
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

#### 编程式导航

```javascript
// 声明式
// <router-link :to=""> </router-link>

// 编程式
router.push(location,onComplete?,onAbort?)//存在history记录
router.replace(location, onComplete?, onAbort?)//替换当前history记录,不添加新记录
router.go(n)//依照history记录前进或者后退

location:
// 比如
this.$router.push(location,onComplete?,onAbort?)

location:可接受的对象
字符串|对象|命名的路由|带查询参数对象
'String'
'{path:'String'}'
'{name:'String',params:{id:"..."}}'
'{path:'String',query:{search:'...'}}'
path不要于params同时指定params会被忽略
规则适用于 to 属性

onComplete和onAbort接受回调函数

n：
1：向前1步
-1：像后1步....等等               
```

#### 命名视图

```html
1.<router-view></router-view>
2.<router-view name="main"></router-view>
3.<router-view name="sidebar"></router-view>
相应的在路由表里需要指定
compoents 指定多个组件对应不同的视图
比如：
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Home,// 没有设置名字的视图
        main: Main,
        sidebar: Sidebar
      }
    }
  ]
})
```

#### 重定向和别名设置

```javascript
在routes:[] 设置 redirect属性，alias属性
const router = new VueRouter({
  routes: [
    { path: '/a', redirect:'/b',}// a-->b ,a的别名是c
  ]
})
redirect接受的属性同样是一个路由属性，甚至可以是函数
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})

alias：
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/c' }
  ]
})
```

##### 重定向和别名的区别

“重定向”的意思是，当用户访问 /a时,URL 将会被替换成 /b,然后匹配路由为 /b。
/a 的别名是 /c,意味着，当用户访问 /c 时,URL 会保持为 /c,但是路由匹配则为 /a,就像用户访问 /a 一样。

#### 取代 组件 $route

为路由配置props属性,取代在组件使用$route.params.键名来获取值，让路由对应的参数可以在组件里直接使用

```javascript
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
// 开启props 就不需要再进行{{$route.params.id}}
// 通过{{id}}使用,因为route.params被设置为了组件属性

可以设置props为一个函数对数据传递进行处理
/search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

