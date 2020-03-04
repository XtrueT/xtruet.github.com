---
layout: post
title: flask-migrate扩展
date: 2019-12-16
author: 霁
header-img:
catalog: true
categories:
- 学习
- Python
tags:
- Python
- flask
---

### 数据库迁移扩展

Flask-Migrate

[文档](https://flask-migrate.readthedocs.io/en/latest/)

这个扩展是根据 Alembic（SQLAlchemy开发人员的一个迁移框架） 进行的封装。

数据库迁移工具可以像类似源代码管理那样，将数据库表模型的更改同步到数据库里。

该扩展对Alembic进行封装并且使用falsk-script进行命令行的使用。

### 安装使用

```bash
pip install Flask-Migrate

pip install Flask-Script
```

在项目里进行创建manage.py

```python
# manage.py
from flask_script import Manager
from flask_migrate import Migrate,MigrateCommand 
from App.models import db,app

migrate = Migrate(app,db)
manager = Manager(app)
manager.add_command('db',MigrateCommand)

# db.drop_all()#删除所有表
# db.create_all()#创建所有表
if __name__ == '__main__':
    manager.run()
# 1.    python manage.py db init  初始化出migrations的文件，只调用一次

# 2.    python manage.py db migrate  生成迁移文件

# 3.    python manage.py db upgrade 执行迁移文件中的升级(需要先进行2在进行3)

# 4.    python manage.py db downgrade 执行迁移文件中的降级(需要先进行2在进行4)
#(第一次生成表，依次执行123)
# 5.    python manage.py db --help 帮助文档


```

