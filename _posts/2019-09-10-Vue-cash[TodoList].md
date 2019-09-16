---
layout:     post
title:      Vue-Todolist和axios使用
subtitle:   学习Vue
date:       2019-09-10
author:     霁
header-img: img/post-bg-ios9-web.jpg
catalog: true
categories:
- 学习
- Vue
tags:
    - Vue
---
### 前言

项目位于[github](https://github.com/XtrueT/vue-cash.git) 

[个人博客](https://xtruet.github.io/)

模仿实现效果：[http://www.todolist.cn/](http://www.todolist.cn/)

实际效果：

![nhF8Zn.gif](https://s2.ax1x.com/2019/09/16/nhF8Zn.gif)

###  安装

```bash
#设置成淘宝的镜像源
#全局安装vue/cli
#
#创建一个基于webpack 模版的项目
yarn config set registry https://registry.npm.taobao.org
yarn global add @vue/cli
#cli2.x
yarn global add @vue/cli-init
vue init webpack vue-cash
#cli3.x
vue create vue-poj
```


vue.config.js 进行内建配置的覆盖

camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名



### 项目文档结构



[![nWCK8H.png](https://s2.ax1x.com/2019/09/16/nWCK8H.png)](https://imgchr.com/i/nWCK8H)

使用yarn 管理 ，api进行axios的配置，assets包括网页的静态文件比如图片什么的，component为组件，utils包含一些工具函数，vue的实例化在 main.js。

### TodoList项目

模仿[www.todolist.cn](http://www.todolist.cn/)

实现，增，删，改

由于各种问题最后将一个todo的数据结构变成了:

#### 数据结构

```javascript
[{
	'todo':String, 
	'isDone':boolean,
	'isEdit':boolean,
	'id':Number, // 其实是根据刚开始时加入数组后获取在数组里的下标赋值
},]
```

#### 对vue的练习方面

包含：

- 基本的生命函数的使用
- 计算属性的使用
- 事件的函数
- 父子传递函数和数据
- 实现浏览器本地存储模块
- 实际上也可以使用watch对数组进行监听，进行保存，但是由于要进行不一样的操作，比如没有更改时不进行保存
- 如果使用了watch就会在操作后进行了保存，而没有判断是否适合保存，大概吧！个人理解

#### 相关文件代码

##### Todo.vue

```vue
<template>
<section id="todo-section">
    <header>
        <label for="todo-input">{{text}}</label>
        <!-- 监听回车事件 -->
        <input id="todo-input" type="text" v-model="todo"  placeholder="todo" @keyup.enter="addTodoItem"/>  
    </header>
    <section>
        <!-- 动态绑定todoList -->
        <!-- 驼峰式命名的props属性需要改变 -->
                

        <!-- todoList是子组件需要的一个props属性，但是在模版中这类驼峰式props需要更换成 todo-list -->
        <!-- 驼峰式命名的props属性需要改变 -->
        
        <!-- 统计进行中的条数 -->
        <h2>进行中<span id="notDoneCount">{{notDoneList.length}}</span></h2>
        <TodoItem :todo-list="notDoneList" @del="delTodoItem" @save="save" @update="updateTodoItem"/>
        <h2>已完成<span id="isDoneCount">{{isDoneList.length}}</span></h2>
        <TodoItem :todo-list="isDoneList" @del="delTodoItem" @save="save" @update="updateTodoItem" style="opacity: 0.5;"/>
    </section>
</section>
</template>


<script>
import TodoItem from './TodoItem'
import storageUtil from '../utils/storageUtil'

export default {
    name: 'Todo',
    // 在这里注册引入的子组件TodoItem
    components:{
        TodoItem,
    },
    // 父组件传递的数据
    props:{
        text:String
    },
    // 此组件的数据
    data(){
        return {
            // 双向绑定
            todo:'',
            // 保存数据
            todoList:[],
        }
    },
    // 进行事件的处理
    methods:{
        save(){
            // 进行保存，保存到浏览器本地存储
            storageUtil.set('todolist',this.todoList);
        },
        addTodoItem(){
            if(this.todo!==''){
                this.todoList.push({
                    todo:this.todo,
                    isDone:false,
                    isEdit:false
                });
                // 由于只靠key值无法区分是那个元素，因为在计算属性里筛选时返回了新的数组导致key值存在冲突
                // 只能在这里进行数据结构重组
                // 将原来数据的下标当作id加入item里作为整个数组的唯一标识
                // 就不会因为已完成和未完成列表里的key值冲突
                let _list = this.todoList.map((item)=>{
                    return {...item,id:this.todoList.indexOf(item)}
                });
                this.todoList = _list;
                this.todo = '';
            }
            this.save();
        },
        updateTodoItem(id,value){
            // 获取原来的值暂存
            let list = storageUtil.get('todolist');
            // console.log(id,value)
            let _value;
            let _key;
            if(list){
                // 由于在删除时出现了最后一个删除失败，原因是
                // 比如id=“1”存在但是数组只有最后一个元素下标为0了只能根据id来选择对应的下标
                list.forEach(item=>{
                    if(item.id===id){
                        _value = item.todo;
                    }
                })
            }
            this.todoList.forEach(item=>{
                if(item.id===id){
                    _key = this.todoList.indexOf(item);
                }
            })
            // 如果不为空就进行保存
            if(value!==''){
                this.todoList[_key].todo = value;
                this.todoList[_key].isEdit = false;
                this.save();
            }else{
                this.todoList[_key].todo = _value;
                this.todoList[_key].isEdit = false;
            }
        },
        // 等待子组件触发这个函数，并拿到key
        delTodoItem(id){
            // console.log(id);
            let _key;
            this.todoList.forEach(item=>{
                if(item.id===id){
                    _key = this.todoList.indexOf(item);
                }
            })
            this.todoList.splice(_key,1);
            this.save();
        },
    },
    // 计算属性,返回过滤的数据或者对象
     // 计算属性,返回过滤的数据或者对象,之前可以v-for和v-if同时使用，现在推荐先计算出要过滤的元素再循环渲染
    computed:{
        isDoneList(){
            return this.todoList.filter(item=>item.isDone);
        },
        notDoneList(){
            return this.todoList.filter(item=>!item.isDone);
        }
    },
    //生命周期函数,模版编译完成
    mounted(){
        // 页面刷新就获取保存在本地存储的数据
        let list = storageUtil.get('todolist');
        if(list){
            this.todoList = list;
        }
    }
}
</script>

<style scoped>
	@import url('../assets/index.css');
</style>
```

三剑客！

在App.vue 引用Todo.vue 并注册该组件就能使用。

##### TodoItem.vue

```vue
<template>
<ol>
    <li v-for="(item,key) in todoList" :key="key">
        <!-- 需要使用:key="item.id"来绑定 对应的item.isDone 
        不然好像是会出现点击如果已经完成和未完成相同的key会都打勾 --> 
        <input type="checkbox" v-model="item.isDone" @change="saveCheck" :key="item.id"/>
        <div @click="setIsEdit(key)">
            <p v-if="!item.isEdit">{{item.todo}}</p> 
            <p v-else-if="item.isEdit">
                <!-- 回车事件，esc事件，失去焦点事件 -->
                <input ref="editInput" type="text" :key="item.id" v-model="item.todo" 
                @keyup.enter="putTodoItem(item.id,item.todo)" 
                @keyup.esc="putTodoItem(item.id,item.todo)" 
                @blur="putTodoItem(item.id,item.todo)"/>
            </p>
        </div>
        <a @click="delTodoItem(item.id)">-</a> 
    </li>
</ol>
</template>

<script>
export default {
    name:'TodoItem',
    props:{
        todoList:Array,
        del:Function,
        save:Function,
        update:Function,
    },
    methods:{
        // 因为这里是对应被筛选过的数组所以需要key来指定他的编辑与否
        setIsEdit(key){
            this.todoList[key].isEdit = true ;
            // 对焦到input框
            if(this.todoList[key].isEdit){
                this.$nextTick(()=>{
                    // 由于位于循环中，需要获取refs数组里的第一个元素，就是我们需要的input框
                    // 聚焦
                    this.$refs.editInput[0].focus()
                });
            }
        },
        // 进行对某一个元素的操作都要使用唯一标识id来进行原数组的操作
        putTodoItem(id,content){
            this.$emit('update',id,content);
        },
        delTodoItem(id){
            // 第一个参数是props里方法对应的函数属性,
            // 后面跟上参数列表是父组件里需要的子组件传回的数据
            // 实现子组件给父组件传递值
            // 单向数据流的概念需要理解，实际上是由父组件改变内容,子组件是触发这个改动
            this.$emit('del',id);
        },
        saveCheck(){
            this.$emit('save');
        }
    }
}
</script>

<style scoped>

</style>
```

##### storageUtil.js


```javascript
// storageUtil.js
/**
 * localStorage set() get() remove()
 * key: string
 * value: any
 * return 
 */

const storageUtil = {
    
    set:(key,value)=>localStorage.setItem(key,JSON.stringify(value)),
    get:(key)=>JSON.parse(localStorage.getItem(key)),
    remove:(key)=>localStorage.removeItem(key)
};

export default storageUtil;
```

[Vue的内建属性Api](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)

##### 运行结果

到此一个TodoList的项目就结束了，运行：

[![nhF8Zn.gif](https://s2.ax1x.com/2019/09/16/nhF8Zn.gif)](https://imgchr.com/i/nhF8Zn)



### 引入axios

#### 添加axios依赖

[axios GitHub地址](https://github.com/axios/axios)   

Promise based HTTP client for the browser and node.js

```bash
# 先进行添加
yarn add axios 
```

#### 配置axios实例

由于在此前我已经在React项目使用过直接使用我配置好的api配置进行api获取数据 并渲染的实例

##### serverConfig.js

```javascript
// serverConfig.js

import axios from 'axios';

//创建axios实例
let Axios_server = axios.create({
    timeout:1500 ,//请求超时时间
    baseURL:'https://api.apiopen.top'// 进行测试的api接口跟地址
})

//请求拦截,在请求前进行请求的配置或检查,比如给配置添加token
Axios_server.interceptors.request.use(
    config =>{
        //判断登录与token的存在// sessionStorage.setItem('token', data["token"]);
        const auth_token = " Flask " + window.sessionStorage.access_token;
        // config.headers.common['Authorization'] = auth_token;
        config.headers = {
            'Content-Type':'application/json',
            'Authorization': auth_token
        }
        return config;
    },
    error =>{
        if(error.request){
            let {message} = error.request.data;
            alert(message);
            return error.request.data;
        }
        return Promise.reject(error)
    }
)
//响应拦截,对api返回的数据进行操作,比如根据状态码进行页面的引导提示
Axios_server.interceptors.response.use(
    response =>{
        let {token} = response.data;
        // console.log(message);
        // console.log(token);
        // console.log(data);
        if (token){
            sessionStorage.setItem('access_token', token);
        }
        return response.data;
    },
    error =>{
        if(error.response){
            return error.response.data;
        }
        else{        
            return Promise.reject(error.request);
        }
    }
)
//并发axios.all([])
//处理响应回调axios.spread(callback)

export {Axios_server};
```

##### server.js

上面是axios的一个实例化并进行了一定的配置,下面是对此实例的对应restful的一些get，post，put，delete的封装函数

```javascript
// server.js
import { Axios_server } from "./serverConfig";

function Axios_post(url,data,that,callback){
    Axios_server.post(
        url,
        data
    ).then(
        (result) =>{
            callback(that,result);//传入this，返回这里的result
        },
    )
    .catch(
        err =>{
            callback(that,err);
            // console.log(err);
        }
    )
}
function Axios_put(url,data,that,callback){
    Axios_server.put(
        url,
        data
    ).then(
        (result) =>{
            callback(that,result);//传入this，返回这里的result
        },
    )
    .catch(
        err =>{
            alert(err);
        }
    )
}
function Axios_delete(url,data,that,callback){
    Axios_server.delete(
        url,
        data
    ).then(
        (result) =>{
            callback(that,result);//传入this，返回这里的result
        },
    )
    .catch(
        err =>{
            callback(that,err);
        }
    )
}
function Axios_patch(url,data,that,callback){
    Axios_server.patch(
        url,
        data
    ).then(
        (result) =>{
            callback(that,result);//传入this，返回这里的result
        },
    )
    .catch(
        err =>{
            alert(err);
        }
    )
}
function Axios_get(url,callback){
    Axios_server.get(
        url
    ).then(
        (result) =>{
            callback(result);//传入this，返回这里的result
        },
    )
    .catch(
        err =>{
            callback(err);
        }
    )
}

//并发
// axios.all([Axios_get()],)
export {Axios_get,Axios_post,Axios_delete,Axios_patch,Axios_put};
```



##### Home.vue

我们在Home.vue里进行api数据的获取

```vue
<!-- Home.vue -->
<template>
    <section>
        <div class="home">
            <div class="options">
                竖向瀑布流：
                <input v-model="direction" type="radio" name="direction" value="column">
                横向瀑布流：
                <input v-model="direction" type="radio" name="direction" value="row">
            </div>
            <div v-if="list.length != 0">
                <ImageWall v-show="direction=='row'"  :list="list" :row="true"/>
                <ImageWall v-show="direction=='column'" :list="list"/>
            </div>
            <p v-if="message==='没有更多了'">
                {{message}}
            </p>
        </div>
    </section>
</template>

<script>
// 在这里引入需要使用的axios的get方法
import {Axios_get} from '../api/server';
import ImageWall from './ImageWall';

export default {
    name:'Home',
    components:{
        ImageWall
    },
    // 提前定义好此组件里需要用到的数据和类型
    data(){
        return{
            list: [],
            direction: 'row',
            flag: false,
            message:'',
            page:1,
            count:'20'
        }
    },
    methods:{
        // 在方法里进行api数据的获取，比如我这里是获取一些图片
        getImage(page=1,count='20'){
            Axios_get(`/getImages?page=${page}&count=${count}`,(rs)=>{
                const {message,result} = rs;
                this.message = message;
                // 如果存在图片数据就添加入list[]里
                result.length===0?this.message = '没有更多了':result.map(item=> this.list.push(item)
                )
            });
        }
    },
    mounted(){
        // 在页面加载完就获取数据
        this.getImage(this.page,this.count);
    },
    created() {
        // 创建时期进行滚动条的监听
        // 滚动到底部就进行获取数据
        window.onscroll = () => {
            if (this.flag) {
                return;
            }
            // 判断是否到达底部
            if (document.documentElement.scrollTop + document.body.clientHeight === document.documentElement.scrollHeight) {
                this.flag = true
                // 进行获取数据,获取下一页的数据并加入到list里
                this.getImage(++this.page,this.count);
                setTimeout(() => {
                    this.flag = false
                }, 500)
            }
        }
    },
}
</script>

<style scoped>
    .options {
        padding: 10px;
        text-align: center;
    }

</style>
```



##### ImageWall.vue

获取完就是对应的渲染了，这里使用别人的一个瀑布流图片加载（目前竖向瀑布流存在bug）

```vue
<!-- ImageWall.vue -->
<template>
    <div :class="{'waterfall-wrap': true, row: row}" ref="container">
    <div v-if="row">
        <div v-for="(item, index) of list" :key="index" class="row-item">
            <img :src="item.img" :style="{height: `${height}px`}">
        </div>
            <div :style="{height: `${height}px`}" class="last-box"></div>
    </div>
    <div v-else>
        <div v-for="(item, index) of list" :key="index" class="column-item">
            <img :src="item.img" alt="">
        </div>
    </div>
    </div>  
</template>
<script>
export default {
    name :'ImageWall',
    // 指定需要的数据并赋予默认值
    props: {
        list: {
            type: Array,
            required: true
        },
        row: {
            type: Boolean,
            default: false
        },
        column: {
            type: Number,
            default: 4
        },
        height: {
            type: Number,
            default: 225
        }
    },
    data () {
        return {
            itemWidth: 0,
            columnData: []
        }
    },
    watch(){
        this.renderList()
    },
    mounted () {
        this.renderList()
    },
    methods: {
        renderList() {
            // 横向排列使用css进行排列
            // 纵向排列使用绝对定位排列
            if (!this.row) {
                // 存储每列已排列的高度
                this.columnData = []
                // 计算出每列应该占总宽度的百分比
                this.itemWidth = `${100 / this.column}% `
                this.$nextTick(() => {
                    // 对所有盒子进行计算绝对定位的位置
                    const boxes = this.$refs.container.getElementsByClassName('column-item');
                    for (let i = 0; i < boxes.length; i++) {
                        this.setElementStyle(boxes[i], this.list[i], i);
                    }
                })
            }
        },
        setElementStyle (element, img, index) {
            // 计算出图片实际在项目中显示的高
            const w = this.$refs.container.offsetWidth / 4;
            const h = ((w - 6) / img.width) * img.height + 6;
            if (index < this.column) {
                element.style.left = `${index * (100 / this.column)}%`;
                this.columnData[index] = this.columnData[index] ? this.columnData[index] + h : h;
            } else {
                // 找出最小高度的列
                let min = {}
                for (let i = 0; i < this.columnData.length; i++) {
                    if (!min.hasOwnProperty('index')) {
                        min = {index: i, value: this.columnData[i]}
                    } else {
                        if (this.columnData[i] < min.value) {
                            min = {index: i, value: this.columnData[i]}
                        }
                    }
                }
                element.style.left = `${min.index * (100 / this.column)}%`;
                element.style.top = `${min.value}px`;
                this.columnData[min.index] += h;
            }
            element.style.width = this.itemWidth;
        }
    }
}
</script>
<style scoped>
    .waterfall-wrap {
    position: relative;
    }
    .waterfall-wrap .column-item {
    position: absolute;
    padding: 3px;
    font-size: 0;
    box-sizing: border-box;
    transition: all 0.3s ease;
    }
    .waterfall-wrap .column-item img {
    max-width: 100%;
    }
    .waterfall-wrap.row {
    display: flex;
    flex-wrap: wrap;
    }
    .waterfall-wrap.row .row-item {
    margin: 5px;
    flex-grow: 1;
    font-size: 0;
    box-sizing: border-box;
    transition: all 0.3s ease;
    }
    .waterfall-wrap.row .row-item img {
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
    }
    .waterfall-wrap.row .last-box {
    margin: 5px;
    flex-grow: 999;
    }
</style>
```

#### 运行结果

这样一个获取数据的实例就完成了

页面显示如图！！！，图片太过搞黄色被禁止上传了。

### 结语

使用vue.cli3进行项目的搭建，和进行todolist实例的开发，使用vue进行基本的数据展示和数据筛选。使用axios进行api数据的获取。对dom的操作等等。

理解相对于React的不一样的地方。