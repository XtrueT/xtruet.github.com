---
layout: post
title: seatunnel-web部署
date: 2023-11-25
author: 霁
header-img:
catalog: true
categories:
- 学习
- ETL
tags:
- seatunnel

---

## 环境配置

环境：Window10、VMware 16

apache-seatunnel-2.3.3-bin.tar.gz

jdk-8u301-linux-x64.tar.gz

apache-maven-3.8.6-bin.tar.gz

apache-seatunnel-web-1.0.0-bin.tar.gz

安装镜像：ubuntu-22.04.3-live-server-amd64.iso



## 安装mysql

下载mysql，安装最新的mysql8.0

```bash
sudo apt update
sudo apt install mysql-server
```

安装完毕mysql会启动，验证mysql的启动状态

```bash
sudo systemctl status mysql
```

```bash
dev@dev:~$ sudo systemctl status mysql
● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2023-11-25 04:25:17 UTC; 18s ago
    Process: 2652 ExecStartPre=/usr/share/mysql/mysql-systemd-start pre (code=exited, status=0/SUCCESS)
   Main PID: 2671 (mysqld)
     Status: "Server is operational"
      Tasks: 38 (limit: 4516)
     Memory: 365.6M
        CPU: 682ms
     CGroup: /system.slice/mysql.service
             └─2671 /usr/sbin/mysqld

Nov 25 04:25:16 dev systemd[1]: Starting MySQL Community Server...
Nov 25 04:25:17 dev systemd[1]: Started MySQL Community Server.
```

修改下root密码

```bash
sudo mysql

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

FLUSH PRIVILEGES;
```

允许mysql远程连接

```bash
cd /etc/mysql/mysql.conf.d
sudo vim mysqld.cnf
## 注释
#bind-address           = 127.0.0.1
#mysqlx-bind-address    = 127.0.0.1

# 重启
sudo service mysql restart

#
sudo mysql -u root -p

mysql> create user 'root'@'%' identified by 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> grant all privileges on *.* to 'root'@'%';
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
Query OK, 0 rows affected (0.00 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.00 sec)
```



## 启动Seatunnel

```bash
cd /home/soft/apache-seatunnel-2.3.3

nohup sh bin/seatunnel-cluster.sh 2>&1 &
```



## 安装apache-seatunnel-web

解压

```bash
sudo tar -zxvf apache-seatunnel-web-1.0.0-bin.tar.gz
```

初始化数据库并执行初始化数据库脚本

```bash
cd /home/soft/apache-seatunnel-web-1.0.0-bin/script

sudo vim seatunnel_server_env.sh

##配置对应的链接user password

## 执行脚本
bash init_sql.sh

##输出如下即可
mysql: [Warning] Using a password on the command line interface can be insecure.
```

修改web的端口和数据源 和配置客户端信息

```bash
sudo vim conf/application.yml 

## 指定密码

##配置客户端信息
sudo cp /home/soft/apache-seatunnel-2.3.3/config/hazelcast-client.yaml  ./conf/
```

下载数据源jar并放到seatunnel 的lib 和web的lib里

这里暂时没有添加数据源其他jar，下载了mysql连接器的jar[Central Repository: mysql/mysql-connector-java/8.0.30 (maven.org)](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.30/)

```bash
sudo cp mysql-connector-java-8.0.30.jar apache-seatunnel-2.3.3/lib
sudo cp mysql-connector-java-8.0.30.jar apache-seatunnel-web-1.0.0-bin/libs/
```

## 启动apache-seatunnel-web

```bash
sudo bash bin/seatunnel-backend-daemon.sh start

## 提示失败
starting seatunnel...
JAVA_HOME is not set
```

经过百度，检查cat /etc/environment文件

```bash
#添加JAVA_HOME

dev@dev:/home/soft/apache-seatunnel-web-1.0.0-bin$ cat /etc/environment
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
JAVA_HOME="/usr/local/java/jdk1.8.0_301"
```

再次启动

```bash
dev@dev:/home/soft/apache-seatunnel-web-1.0.0-bin$ sudo bash bin/seatunnel-backend-daemon.sh start
starting seatunnel...
/home/soft/apache-seatunnel-web-1.0.0-bin/bin
seatunnel started
```

访问ip:8801 admin/admin

[![pi0CyPf.png](https://z1.ax1x.com/2023/11/25/pi0CyPf.png)](https://imgse.com/i/pi0CyPf)