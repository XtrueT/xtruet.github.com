---
layout: post
title: React Hook form 表单校验
date: 2019-10-07
author: 霁
header-img:
catalog: true
categories:
- 学习
- React
tags:
- React
---

### 需求

在项目里需要进行表单的校验。

而在react里处理表单又是非常难受的一件事。

要么我们使用受控组件，要么一个一个获取。。。

而现在我就要介绍一款，react hook 的表单校验库。

[官网：react-hook-form](https://react-hook-form.com/api)

真的非常好用，个人觉得。

原生input，form多好啊。也可以结合ant 等的表单进行使用，更多的校验规则也可以指定别的库。

更多api可以查看官网。下面就描述一下怎么使用，以及做一个带校验密码是否一致的注册表单。

妙的是，可以直接返回一个回调函数让我们进行整个被注册表单元素的所有键值对象

`{name:,value:}`

我们需要编写函数进行提交就ok。

![uvJayq.png](https://s2.ax1x.com/2019/10/13/uvJayq.png)

### 开始

#### 安装

```bash
yarn add react-hook-form
```

#### 使用

在register表单里引入

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useForm from 'react-hook-form';

import Toast from './Toast';
```

在组件里进行声明

```jsx
const {register,handleSubmit,errors,watch,clearError} =  useForm();
```

介绍一下分别是什么吧，

`register` 使用一个`ref `进行 需要使用校验的表单元素。`name`属性是必须的。

比如注册一个`input`框

```jsx
<input 
type="text" 
name="username" 
id="username" 
placeholder="username" 
aria-describedby="helpId" 
ref={register({
    required:true,
    maxlength: 6,
    minLength:2,
})}/>
{errors.username&&Toast.error('2-6字符')}
```

使用`ref`进行这个`input`框的注册，

并且指定它的一些校验规则：可以是一个验证规则，也可以是一个正则表达式，

包括一些原生的校验。最大最小什么的。

如果不通过验证就会返回一个错误对象。

我们要使用这个错误对象，需要通过使用`name`属性来获取对应的错误消息。

我们可以进行错误的设置，也可以进行错误的清除。

因为存在`setError`和`clearError`。

然后我们再把错误消息渲染出来提示就好了。

#### 校验指定

指定邮箱的`input`类型好像默认会使用邮箱的校验错误提示而不出现自定义提示？？？

暂时不想了。

指定一个正则来校验邮箱格式：。

`pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,`

校验一个密码框和一个确认密码框。

主要是使用watch("input_name") 来返回值，

根据校验`validate`使用自身`value`跟监听的ref的input的值进行比较。

```jsx
validate:{
    // 设置validate返回的message
    message:value=>
    value===watch('password')?
        clearError()://两个表单值一样的时候清除错误
    "confirm password fail",//否则返回一个指定的错误消息
}}
```

#### 表单提交

`handleSubmit`接受一个函数返回表单的值。

都能拿到所有值了，可以进行操作提交了吧。使用什么ajax啦axios的。

```jsx
const onSubmit = data =>{
    console.log(data);
    JSON.stringify(data);
    console.log(data);
}
```

指定`onSubmit`事件。

```jsx
<form className="form" onSubmit = {handleSubmit(onSubmit)}>
    <div className="form-item">
        <button className="form-btn" type="submit">注册</button>
    </div>
    {props.children}
</form>

```

最后的代码是这样：

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useForm from 'react-hook-form';

import Toast from './Toast';


export default function RegisterForm(props) {

    const {register,handleSubmit,errors,watch,clearError} =  useForm();

    const onSubmit = data =>{
        console.log(data);
        JSON.stringify(data);
        console.log(data);
    }
    return (
        <form className="form" onSubmit = {handleSubmit(onSubmit)}>
            <div className="form-item">
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    placeholder="username" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        maxlength: 6,
                        minLength:2,
                    })}/>
                {errors.username&&Toast.error('2-6字符')}
            </div>
            <div className="form-item">
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="email" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    })}/>
                {errors.email&&Toast.error('请输入正确的邮箱格式')}
            </div>
            <div className="form-item">
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="password" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        maxLength:16,
                        minLength:6,
                    })}/>
                {errors.password&&Toast.error('6-16字符')}
            </div>
            <div className="form-item">
                <input 
                    type="password" 
                    name="confirm_password" 
                    id="password" 
                    placeholder="confirm password" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        validate:{message:value=>value===watch('password')?clearError():"confirm password fail",}
                    })}/>
                {errors.confirm_password&&Toast.error(errors.confirm_password.message)}
            </div>
            <div className="form-item">
                <div className="checkbox-item box">
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="agree"
                            name="agree"
                            ref={register({
                                required:true
                            })}/>
                        <label htmlFor="agree" className="checkbox">同意用户协议</label>
                        {errors.agree&&Toast.error('请选择同意用户协议')}
                    </div>
                    <Link to="./login">已有帐号?去登录</Link>
                </div>
            </div>
            <div className="form-item">
                <button className="form-btn" type="submit">注册</button>
            </div>
            {props.children}
        </form>
    )
}
```

