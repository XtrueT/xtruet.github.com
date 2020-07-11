---
layout: post
title: Spring-AOP
date: 2020-01-12
author: 霁
header-img:
catalog: true
categories:
- 学习
- Java
tags:
- Java
- Spring
---

## Spring AOP

Spring AOP是Spring里非常重要的功能模块之一，提供了面向切面编程实现，面向切面编程在事务处理、日志记录、安全控制等方面广泛使用。

### AOP概述

AOP（Aspect Oriented Programming）面向切面编程，与 OOP（Object Oriented Programming）面向对象编程相辅相成，提供了与OOP不同的抽象软件结构视角。

> 在OOP中通过封装继承等方式重用代码，但是还是会存在同样的代码分散在不同的地方，为了解决这些问题。AOP采取横向抽取机制，将分散的重复代码提取出来，在程序编译或运行阶段将这些重复代码应用到需要的地方。

#### AOP术语

1. 切面（Aspect）

   > 指代封装横切到系统功能（如事务处理）的类

2. 连接点（Joinpoint）

   > 指程序运行中的一些时间点，如方法调用或异常抛出

3. 切入点（Pointcut）

   >指需要处理的连接点，在Spring AOP中，所有方法执行都是连接点，切入点只是一个描述信息，修饰连接点，通过切入点确定那些连接点需要被处理。

4. 通知（Advice）

   >由切面添加到特定连接点的一段代码，是切面开启后切面的方法，是切面的具体实现。
   >
   >（增强处理的功能方法）

5. 引入（Introduction）

   >允许在现有的实现类中添加自定义的方法和属性

6. 目标对象（Target Object）

   > 所有被通知的对象

7. 代理（Proxy）

   >是通知应用到目标对象之后被动态创建的对象

8. 织入（Weaving）

   >是将切面代码插入到目标对象上，从而生成代理对象的过程
   >
   >3种AOP织入方式
   >
   >1. 编译期织入，需要特殊的Java编译器
   >2. 类装载期织入，需要特殊的类装载器
   >3. 动态代理织入，（Spring AOP 默认方式），在运行期给目标类添加通知生成子类的方式。
   >
   >AspectJ（采用编译期和类装载器织入）

### 动态代理

Java中有多种动态代理技术：JDK、CGLIB、Javassist、ASM

常用JDK与CGLIB（Spring AOP中也是）

#### JDK动态代理

JDK动态代理必须借助一个接口才能产生代理对象，在Spring中使用业务接口的类默认使用该方式进行AOP实现。

1. 创建切面类（包含多个通知）
2. 创建代理类（必须实现InvocationHandler接口，编写代理方法）

#### CGLIB动态代理

对于没有提供接口的类，采用CGLIB（Code Generation Library）动态代理。

CGLIB是一个高性能开源的代码生成包，采用非常底层的字节码技术，对目标类生成一个子类，对子类进行功能增强。

1. 创建切面类
2. 创建代理类（实现MethodInterceptor接口）

### AOP实现

#### 基于代理类的AOP实现

Spring默认使用JDK动态代理，ProxyFactoryBean创建代理是Spring AOP实现的最基本方式。

在Spring中通知在目标类方法中的连接点位置，可以分为6中通知类型：

1. 环绕通知

   > 目标方法执行前后的实施增强

2. 前置通知

   >目标方法执行前的实施增强

3. 后置返回通知

   >目标方法 成 功 执行后实施增强

4. 后置通知

   >目标方法执行后实施增强（不管异常与否都执行，可用以释放资源）

5. 异常通知

   >目标方法抛出异常后实施增强

6. 引入通知

   >在目标类中添加新的方法和属性

ProxyFactoryBean负责为其他Bean实例创建代理实例，

```xml
<beans>
    <!-- 其他bean 切面bean 目标对象bean等省略-->
    <!-- ProxyFactoryBean -->
	<bean id="testDaoProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
    	<property name="proxyInterfaces" value="实现的接口类"/>
    	<property name="target" ref="引用的目标对象的bean"/>
     	<property name="interceptorNames" value="需要织入的切面类bean"/>
        <!--指定代理方式,默认为false为JDK动态代理,true为CGLIB动态代理-->
    	<property name="proxyTargetClass" value="true"/>
    </bean>
</beans>
```

### AspectJ开发

AspectJ是一个Java语言的 AOP框架。Spring 2.0 后引入AspectJ的支持，建议往后使用AspectJ实现Spring AOP。

#### 基于XML配置

通过XML配置切面，切入点，通知等

applicationContext.xml

```xml
<!--beans-->
...
<!--AOP 配置-->
<aop:config>
	<aop:aspect ref="切面类">
        <!-- expression=execution(* 包名.*.*(..)) 指定该包下所有类型所有类名所以方法任意参数-->
		<aop:pointcut expression="指定要增强那些方法"/>
		<aop:before method="前置通知的方法实现" pointcut-ref="关联的切入点"/>
		<aop:after-returning method="后置返回通知" pointcut-ref=""/>
		<aop:around method="环绕" pointcut-ref=""/>
		<aop:after-throwing method="异常" pointcut-ref=""/>
		<aop:after method="后置" pointcut-ref=""/>
		<aop:declare-parents types-matching="" implement-interface="" delegate-ref=""/>
    </aop:aspect>
</aop:config>
```

繁杂！

#### 基于注解

推荐使用注解方式

```java
@Aspect
@Pointcut
@Before
@AfterReturning
@Around
@AfterThrowing
@After
```

1. 创建切面类

   编写好相应注解

2. 创建配置文件

   扫描包让注解生效等

   启动基于注解的AspectJ支持

```xml
<beans>
    <!--指定需要扫描的包-->
    <context:component-scan base-package=""/>

    <!--启动基于注解的AspectJ支持-->
    <aop:aspectj-autoproxy/>
</beans>
```

