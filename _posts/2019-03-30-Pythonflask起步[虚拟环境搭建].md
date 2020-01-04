---
layout:     post
title:      Python-flask起步[虚拟环境搭建]
subtitle:   学习python
date:       2019-03-30
author:     霁
# header-img: img/post-bg-ios9-web.jpg
catalog: true
categories:
- 学习
- Python
tags:
    - Python
---

### 开始

 使用自带 python -m venv +{创建的文件名} 命令

```bash
python -m venv 
```
比如创建一个 env_1

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330162542429.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDAyOTc4NQ==,size_16,color_FFFFFF,t_70)

#### 成功创建

创建成功后进入Scripts

```powershell
cd Scripts
```
powershell 下需要运行


```powershell
 Activate.ps1
```

cmd下运行 

```powershell
activate.bat
```

#### 错误

 若出现以下错误，需要管理员权限运行命令行

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330162638673.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDAyOTc4NQ==,size_16,color_FFFFFF,t_70)

#### 权限问题

若仍然没有权限则需要更改权限

- Restricted： 禁止运行任何脚本和配置文件。
- AllSigned ：可以运行脚本，但要求所有脚本和配置文件由可信发布者签名，包括在本地计算机上编写的脚本
- RemoteSigned ：可以运行脚本，但要求从网络上下载的脚本和配置文件由可信发布者签名；       不要求对已经运行和已在本地计算机编写的脚本进行数字签名。
- Unrestricted ：可以运行未签名脚本（危险！）              

```powershell
 set-executiopolicy remotesigned 
```
设置为 remotesigned 选择全是（A）即可让每次都能运行该脚本，y则是这次 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330162707825.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDAyOTc4NQ==,size_16,color_FFFFFF,t_70)



#### 激活成功

成功后运行激活脚本进入虚拟环境

升级pip，安装其他库等操作，利用` pip -V` 查看版本等

如果出现pip命令与全局混乱的情况，可能是路径存在中文的问题，反正我改了个路径就对了（嘻嘻！)

#### pip使用

如上图我pip list 出来的还是全局的包名

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330162945331.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDAyOTc4NQ==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330162756684.png)
#### 解决

更换路径创建虚拟环境文件夹后一切顺利

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330163038321.png)

#### 退出虚拟环境

运行以下命令

```powershell
deactivate
```

### 结语

在Linux下则略有不同，可参考官方详细文档进行激活步骤。

后来基本使用bash进行

```bash
#即可激活
$ source c:/Users/霁/Desktop/Flaskweb_movie/env/Scripts/activate 

#退出
$ deactivate
```

