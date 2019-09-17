---
layout: post
title: 在centos上搭建python-web服务(配置代理)
date: 2019-4-23
author: 霁
header-img:
catalog: true
categories:
- 学习
- Python
tags:
- Python

---
## 官方文档

[python官方文档](https://docs.python.org/zh-cn/3.7/)

## Centos 7下安装python3

Centos版本：7.6

python3版本：3.7.2 

为了防止出现某些问题，先安装下面的依赖 

```bash
yum install openssl-devel bzip2-devel expat-devel gdbm-devel readline-devel sqlite-devel gcc gcc-c++  openssl-devel  
```

出现以下错误就安装（不过还是提前安装一下）

![n5YBgU.png](https://s2.ax1x.com/2019/09/17/n5YBgU.png)

```bash
# 上面安装了这里不需要再安装
yum install -y gcc 
```



![n5YXPP.jpg](https://s2.ax1x.com/2019/09/17/n5YXPP.jpg)

```bash
yum -y install zlib*
```

出现ctypes错误需要先安装libffy

```bash
yum install libffi-devel -y
```

下载Python

```bash
wget --no-check-certificate https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tgz
```

将该下载路径下的安装包移动到usr目录下

比如从 

```bash
# 首先到安装包所在我位置
mv  Python-3.7.2.tgz  /root/usr

# 进入usr
cd /usr
#找到安装包 

ls
# 解压它
tar -xzvf Python-3.7.2.tgz

# 解压完毕进入文件夹
cd Python-3.7.2

./configure --prefix=/usr/python

```

将Python安装到该目录的python文件夹里



![n5NZFI.jpg](https://s2.ax1x.com/2019/09/17/n5NZFI.jpg)

```bash
#编译 
make 
#安装 
make install
```

安装完成，如下

![n5NUpV.jpg](https://s2.ax1x.com/2019/09/17/n5NUpV.jpg)

返回上一层看见有python文件夹

![n5Ncfx.jpg](https://s2.ax1x.com/2019/09/17/n5Ncfx.jpg)

为python3建立软链接，相当配置环境变量。

```bash
ln -s /usr/python/bin/python3 /usr/bin/python3
```

![n5NW6O.jpg](https://s2.ax1x.com/2019/09/17/n5NW6O.jpg)

```bash
ln -s /usr/python/bin/pip3 /usr/bin/pip3
```

配置pip3，演示安装flask如下

![n5UNEd.jpg](https://s2.ax1x.com/2019/09/17/n5UNEd.jpg)

![n5NxBQ.jpg](https://s2.ax1x.com/2019/09/17/n5NxBQ.jpg)

更新pip 

```bash
pip3 install –upgrade pip
```

至此安装完毕

## 安装uwsgi

```bash
pip3 install uwsgi
```



![](https://ask.qcloudimg.com/draft/5206638/kmv1dvwsjh.png)

如果输入uwsgi不能识别出来

建立一下软链接 

```bash
ln -s /usr/python/bin/uwsgi /usr/bin/uwsgi
```

## 配置uwsgi

```bash
[uwsgi]
#uwsgi启动时，所使用的地址和端口（这个是http协议的）
http=0.0.0.0:5000
#uwsgi 启动时所使用的地址与端口(这个是socke协议）
socket=0.0.0.0:8001
#指向网站目录就是你那个包含flask项目的文件夹（如复制记得更改）
chdir=/home/xrf/mypython/flaskWeb
#python 启动程序文件就是包含if __name__ == "__main__":manager.run()的py文件（记得改哦）
wsgi-file=run.py
#python 程序内用以启动的application 变量名   就是这个：app = Flask(__name__)(记得改哦)
callable=app
#处理器数
processes=4
#线程数
threads=2
#状态检测地址
stats=127.0.0.1:9191
```

![](https://ask.qcloudimg.com/http-save/5206638/4tlsygvnrf.jpg)

```python
#app.py
from flask import  Flask
app = Flask(__name__)
@app.route("/")
def hello():
    return "Hello World"
```



```python
#run.py
from app import app
from flask_script import Manager, Shell

manager = Manager(app)

def make_shell_context():
    return dict(app=app)
manager.add_command("shell", Shell(make_context=make_shell_context))
@manager.command
def deploy():
    pass
if __name__ == "__main__":
   manager.run()
```



![](https://ask.qcloudimg.com/http-save/5206638/xx9md38t64.jpg)

```
python3 run.py runserver --host 0.0.0.0

测试一下通过命令启动一个小flask应用能否成功。
```

![](https://ask.qcloudimg.com/http-save/5206638/6j5f9qd4en.jpg)

好了现在我们可以正常在本机也就是虚拟机里启动flask自带的web服务应用。

事实上现在也可以让window下访问了

配置完uwsgi config.ini保存在项目文件夹里。

使用 以下命令启动uwsgi 

```bash
uwsgi config.ini
```

![](https://ask.qcloudimg.com/draft/5206638/x3rxfl04f9.png)

我在window 下可以访问该服务了（不是通过直接运行run.py，直接用以上命令即可）

![](https://ask.qcloudimg.com/draft/5206638/yx1aazbxhm.png)

## 安装nginx

按照官网文档进行安装[http://nginx.org/en/linux\_packages.html#RHEL-CentOS](http://nginx.org/en/linux_packages.html#RHEL-CentOS)

![](https://ask.qcloudimg.com/http-save/5206638/b7dz4ss2d5.jpg)

也可以参考一下[https://www.jianshu.com/p/da28ec28ef4b](https://www.jianshu.com/p/da28ec28ef4b)

```bash
 yum -y install nginx 我的好像是这样就ok了
```

![](https://ask.qcloudimg.com/http-save/5206638/f6xv4p6o2h.jpg)

```bash
#启动：
service nginx start 

#关闭：
service nginx stop

#重启：
service nginx restart

#更改配置后也可以不重启，而使用 加载新配置：
nginx -s reload
```

我不修改它的配置，安装完后使用默认配置可以正常进行。到这里安装nginx完毕

![](https://ask.qcloudimg.com/http-save/5206638/z7z32rnhrz.jpg)

![](https://ask.qcloudimg.com/http-save/5206638/s5r5d6oixx.jpg)

## 配置nginx

进入nginx安装文件夹，修改它的配置

![](https://ask.qcloudimg.com/draft/5206638/c1ckccotb2.png)

先说明一下我的连接uwsgi还有点问题，配置是错误的不用跟着打了。。。（有大神会烦请教教我，我还。。。）

![](https://ask.qcloudimg.com/draft/5206638/jw55z2qpgy.png)

我修改它的配置出现如下问题：

![](https://ask.qcloudimg.com/draft/5206638/6jo0pa8w1e.png)

```bash
nginx -t 查看nginx的配置文件
```

![](https://ask.qcloudimg.com/draft/5206638/os4ph5xrec.png)

这里说明了一个错误，server的位置出现错误，我是因为将server{}写在了http{}外面

```bash
nginx -t -c /etc/nginx/nginx.conf
```

![](https://ask.qcloudimg.com/draft/5206638/ncmfdfup3t.png)

然后又出现了另外一个错误

SELinux 与强制访问控制系统

SELinux 全称 Security Enhanced Linux (安全强化 Linux)，是 MAC (Mandatory Access Control，强制访问控制系统)的一个实现，目的在于明确的指明某个进程可以访问哪些资源(文件、网络端口等)。强制访问控制系统的用途在于增强系统抵御 0-Day 攻击(利用尚未公开的漏洞实现的攻击行为)的能力。所以它不是网络防火墙或 ACL 的替代品，在用途上也不重复。

![](https://ask.qcloudimg.com/draft/5206638/375ntelmtv.png)

原因是我监听端口是8000

更改为80就可以了

![](https://ask.qcloudimg.com/draft/5206638/ftfs72cm28.png)

![](https://ask.qcloudimg.com/draft/5206638/qdnltouwz9.png)

![](https://ask.qcloudimg.com/http-save/5206638/3j4j515v0s.jpg)

![](https://ask.qcloudimg.com/http-save/5206638/fy7crb8kin.jpg)

这个是我最后的配置，但是也不对呢，o(︶︿︶)o 唉



```bash

让nginx服务开机自启
systemctl enable nginx.service
查看服务
systemctl list-units --type=service

```

```bash
上次nginx与uwsgi的连接失败，所以我们来看看错误日志
sudo vim /var/log/nginx/error.log
```

![](https://ask.qcloudimg.com/draft/5206638/0raq91ttwy.png)

## 出现502错误的原因：

可能是

selinux的原因

我们可以尝试关闭

```bash
sudo vim /etc/selinux/config
更改
SELINUX=disabled
然后重新启动
reboot
```

但是我发现我的还是8行ヾ(≧O≦)〃嗷~

然后我就找啊找啊，原因竟是权限问题

然后我们更改nginx的配置

进入到你的nginx的安装目录找到nginx.conf

```bash
vim nginx.conf 
修改user
user root;
```

![](https://ask.qcloudimg.com/draft/5206638/mfbz6yscdz.png)

访问成功！！！

![](https://ask.qcloudimg.com/draft/5206638/741tw5kybz.png)

## 配置

下面是我的两个配置

uwsgi：（项目文件夹里的uwsgi配置）

我们可以使用uwsgi.sock文件连接nginx也可以指定为host : port

就像下面一样。

![](https://ask.qcloudimg.com/draft/5206638/b0qlpvyhxw.png)

代码就不给了，不多，自己敲一下

我们看了nginx.conf

可以看见

![](https://ask.qcloudimg.com/draft/5206638/6dl9ore6wx.png)

所有我们不要改动它的默认配置nginx.conf（当然要改的还是要改的）

```bash
进入配置文件夹
cd conf.d
新建一个配置
vim flaskWeb.conf
```

flaskWeb.conf

![](https://ask.qcloudimg.com/draft/5206638/wgxe5bw4iq.png)

也是可以两种连接，（还有更多吧，不太懂，查阅基本这样，终于能用我就这样了）

![](https://ask.qcloudimg.com/draft/5206638/jkug0n8pkx.png)

到这里就结束了出现问题看看日志。（祝大家顺利ヾ(≧O≦)〃嗷~）

