---
layout: post
title: 使用ReactHook和context实现登录状态的共享
date: 2019-10-08
author: 霁
header-img:
catalog: true
categories:
- 学习
- React
tags:
- React
---

### 目的

为实现登录后的路由跳转以及路由鉴权。和应用的登录状态的更改。

使用react hook 和应用上下文context进行一个自定义的hook的开发。

### 实现效果

将登录表单提交后返回的登录结，根据登录结果进行保存token以及登录用户的信息。

将整个context里的状态更新。

### 路由鉴权

我们可以在路由跳转的时候添加一个组件进行包裹路由组件。

比如这样：

使用 `react-router`的`withRouter`进行组件的高阶转换。

我们还可以在用户拿到一个url后进行访问这样url的时候，如果我们的组件是由AuthRouter进行转发的，

那么就需要经过我们自定义的 `LoginState`函数进行查看本地存储或者session里有没有保存登录令牌等信息

来确认你是否已经登录过。

具体流程：

1. 编写LoginState函数进行获取保存的状态。

2. 编写组件，判断用户是否登录。

3. 登录态，返回要指向的权限组件。

4. 未登录态，返回重定向到登录组件。

5. 包括不是从公共组件来的URL访问，将要访问的地址 pathname保存在location的state里

   提供给登录组件进行返回到要访问的页面。
   
   {% raw %}
   
   {% comment %} 这里是各种包含奇怪花括号 {{{0}}} 的地方 {% endcomment %}

```jsx
import React ,{Component } from 'react';
import {withRouter} from 'react-router';
import {Route,Redirect } from 'react-router-dom';
import {LoginState} from '../utils/authUtil';
import Toast from '../components/Toast';

class AuthRouter extends Component{
    render(){
        const {component:Component,...rest} = this.props;
        const {isLogged} = LoginState();
        return(
            <Route
                {...rest}
                render = {
                    props=>{
                        // console.log(props);
                        if(isLogged){
                            return <Component {...props}/>
                        }else{
                            Toast.info("你还没有登录！")
                            


                            //return <Redirect to={{
                                pathname:'/login',
                                // 保存切换到登录页前的地址
                                state:{
                                    from:props.location.pathname
                                }
                            //}}/>
                        }
                    }
                }
            />
        )
    }
}
export default withRouter(AuthRouter);
```

{% endraw %}

具体使用：

根据指定的路由表进行渲染：

你也可以一个一个的进行编写，或者将他们放到一个不同的地方。哪里需要就哪里引用。符合v4的建议。

```jsx
import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import AuthRouter from './AuthRouter';
import routes from './routes';

function LayoutRoutes(){
    //不可以使用 React.Fragment（key值） 包裹 否则只有第一一路由生效？？ 
    return (
    <Switch>
        {routes.map(item=>{return(
            item.isAuth?
            <AuthRouter  path={item.path} component={item.component}  key={item.path}/>:
            <Route exact={item.exact} path={item.path} component={item.component} key={item.path}/>
        )})}
        <Redirect to="/"/>
    </Switch>
    )
}

export default LayoutRoutes;
```

好了，实现了路由鉴权后，就是登录状态了。

### 登录状态共享

也就是会话状态共享。

我们编写一个自定义的hook

暂时名字为：userSessionHook

1. 编写action，返回action类型和payload
2. 编写reducer，处理action。
3. 编写userSession。返回state和dispatch函数。

#### action

分析一下需要什么。

会话嘛，就是需要一个开始状态和一个关闭状态。

分别返回创建会话和关闭会话就行了。

```javascript
const CREATE_SESSION = "CREATE_SESSION";
const CLOSE_SESSION = "CLOSE_SESSION";


//创建会话的函数
const createSession = (user_data) => ({
    type: CREATE_SESSION,
    payload:user_data
});

//关闭会话的函数
const closeSession = () => ({
    type: CLOSE_SESSION,
});

export {
    CREATE_SESSION,
    CLOSE_SESSION,
    createSession,
    closeSession,
}
```

#### reducer

处理两个action，分别是创建会话和关闭会话。返回新的state。

根据类型进行保存和移除登录信息。并设置初始状态的登录态。

达到更改整个应用的登录状态的改变。

```javascript
import { CREATE_SESSION,CLOSE_SESSION } from '../actions/sessionAction';
import storageUtil from '../../utils/storageUtil';
import apiConfig from '../../api/apiConfig';


export const sessionReducer = (state,action) =>{
    const {type,payload} = action;
    switch (type) {
        case CREATE_SESSION:{
            if(payload){
                storageUtil.set(apiConfig.user_data,payload);
            }
            return Object.assign({},state,{
                user_data:payload,
                isLogged:true,
            });
        }
        case CLOSE_SESSION:{
            try {
                storageUtil.remove(apiConfig.token_name);
                storageUtil.remove(apiConfig.user_data);
            } catch (error) {
                console.log(error)
            }
            return Object.assign({},state,{
                isLogged:false,
            });
        }
        default:
            return state;
    }
}
```

#### useSession

上述就是纯封装的函数，你也可以将上述两个都写到useSession里。

利用 react 的useReducer，useEffect来进行状态的变换和监听。

```javascript
import {useEffect,useReducer} from 'react'
import {sessionReducer} from './reducers/sessionReducer';
import {createSession,closeSession} from './actions/sessionAction';

export default function useSession(initData) {

    const [sessionState, sessionDispatch] = useReducer(sessionReducer,initData);

    // 查看会话更改
    useEffect(() => {
        console.log({
            newSession:sessionState,
            date:new Date().getTime(),
        })
    }, [sessionState]);

    const login = (user_data)=> sessionDispatch(createSession(user_data));
    const logout = ()=>sessionDispatch(closeSession());

    return [login,logout,sessionState];
}
```

这里我不再将分发函数暴露出去。因为我只需要封装好了的login和logout函数进行登录和退出的处理就ok。

useEffect 也不是必须的，只是我需要来查看一下状态的更新。

#### 使用

上面我并没有声明一个上下文对象。我是在App.js里声明的。你也可以将上下文对象声明在这里，并且封装出一个类似store的东西进行App组件的包裹。以达到类似的全局状态共享。

```jsx
import React,{createContext} from 'react';
import { BrowserRouter } from 'react-router-dom';
import useSession from './hooks/useSessionHook';
import { LoginState } from './utils/authUtil';
import Layout from './views/Layout';

// 上下文
export const AppContext = createContext(undefined);

function App() {

  const [login,logout,sessionState] = useSession({
    ...LoginState(),
  })

  return(
    <BrowserRouter>
      <AppContext.Provider value={{login,logout,sessionState}}>
        <Layout/>
      </AppContext.Provider>
    </BrowserRouter>
  )
}

export default App;
```

在最根组件引入useSession，并且赋予应用的一个全局状态。我这里是使用LoginState返回的数据。

当然，这里你也可以设置其他的全局属性，比如主题什么的。

不要忘记将值通过

```jsx
<AppContext.Provider value={{login,logout,sessionState}}>
```

传递下去。并且暴露出这个 AppContext好让我们在其他组件里引用这个上下文对象。

### 结合路由使用

在需要全局状态的组件里通过，useContext将全局状态拿出来。

需要更改全局状态就通过调用函数进行更改。

下面介绍导航的渲染和登录的跳转

根据登录状态渲染相应的导航：

```jsx
import React,{useContext} from 'react';
import { NavLink } from 'react-router-dom';
import routes from '../route/routes';
import {AppContext} from '../App.js';

export default function Nav() {
	// 使用前先获取上下文对象
    const ct = useContext(AppContext);
	// 获取全局状态里的登录状态
    const {isLogged} = ct.sessionState;
	// 分别根据是否公共导航,权限导航，登录后导航进行导航筛选。
    return (
        <nav className="rush-nav">
            {routes.map(item=>
            <React.Fragment key={item.path}>
                {
                    item.isPublic?
                    <NavLink to={item.path} exact activeClassName="nav-active">
                    {item.name}
                    </NavLink>:
                    !item.isAuth&&!isLogged?
                    <NavLink to={item.path} exact activeClassName="nav-active">
                    {item.name}
                    </NavLink>:
                    item.isAuth&&isLogged?
                    <NavLink to={item.path} exact activeClassName="nav-active">
                    {item.name}
                    </NavLink>:''
                }
            </React.Fragment>
            )}
        </nav>
    )
}
```

登录跳转：

实际上是演示一个更改全局状态的例子。

1. 编写登录表单
2. 发送登录信息
3. 引用全局的登录函数
4. 更改全局登录状态
5. 进行使用history实现函数式的导航跳转。

```jsx
import React,{ useContext } from 'react';
import { Link ,withRouter} from 'react-router-dom'
import useForm from 'react-hook-form';

import { Axios_post } from '../api/server';

import Toast from './Toast';
import { AppContext } from '../App';
import { toQueryString } from '../utils/utils';
import apiConfig from '../api/apiConfig';

// const url = '/loginUser';
const url = '/developerLogin';

function LoginForm(props) {
    console.log(props);
    const ct = useContext(AppContext);
    const {isLogged,login} = ct;

    if (isLogged) {
        Toast.info('你已经登录过了')
        props.history.push('/');
    }

    const {register,handleSubmit,errors} =  useForm();

    const onSubmit = data =>{
        console.log(data);
        data = {...data,aipkey:apiConfig.apikey};
        // data = JSON.stringify(data);
        data = toQueryString(data);

        Axios_post(`${url}?${data}`,'',(rs)=>{
            console.log(props);
            if(!rs){
                return;
            }
            const {code,message,result} = rs;
            if(code!==200){
                Toast.error(message);
            }else{
                login(result);
                Toast.success(message);
                if (props.location.state) {
                    props.history.push(props.location.state.from);
                }else{
                    props.history.push('/');
                }
            }
        })
    }

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-item">
                <input 
                    type="text"
                    name="name" 
                    id="name" 
                    placeholder="name" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        maxLength:4,
                        minLength:2,
                        // pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    })}/>
                {errors.name&&<span className="error-help">{'2-4字符'}</span>}
            </div>
            <div className="form-item">
                <input 
                    type="password" 
                    name="passwd" 
                    id="passwd" 
                    placeholder="passwd" 
                    aria-describedby="helpId" 
                    ref={register({
                        required:true,
                        maxLength:16,
                        minLength:6,
                    })}/>
                {errors.passwd && <span className="error-help">{'6-16字符'}</span>}
            </div>
            <div className="form-item">
                <div className="checkbox-item box">
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="save_login"
                            name="save_login"
                            ref={register}/>
                        <label htmlFor="save_login" className="checkbox">记住我</label>
                    </div>
                    <Link to="">忘记密码?</Link>
                </div>
            </div>
            <div className="form-item">
                <button className="form-btn" type="submit">登录</button>
            </div>
            {props.children}
        </form>
    )
}
export default withRouter(LoginForm);
```

值得注意的是`react-router v4+`需要使用`withRouter`进行转换组件才能拿到

`history` ，退出类似；

### 结语

通过编写这么一个使用会话状态的hook，我们可以将其扩展为全局的状态管理。

比如进行主题色的更改，全局的语言地区化更改等等一些全局属性。

当然了，为什么在App.js里初始化为登录状态呢。因为数据不保存在本地存储或者其他地方。用户刷新浏览器就会重新初始化状态。所以登录的状态等的全局状态是需要进行保存的。

当然，如果是临时的状态不保存也ok。

在实际需要中，我们不应该多次使用上下文进行传递数据。而应该设计让组件拥有他的单独的状态。

而上下文这样的对象，适合在一些全局的状态的传递，并且这些全局状态是不会经常更改的，就像上述的登录会话状态，这个是不会经常变动的。