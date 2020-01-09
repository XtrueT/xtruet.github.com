---
layout: post
title: 使用flask_sqlalchemy
date: 2019-12-11
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

## flask 数据库选择

你能找到大多数的数据库引擎的Python包，它们不仅开源还有社区支持。Flask并不限定数据库包的选择，你能够使用MySQL, Postgres, SQLite, Redis, MongoDB 或 CouchDB中的任何一种。

如果这些选择还不够，你还可以选择包的抽象层，比如：SQLAlchemy、MongoEngine。它们允许你在更高的层次上直接和Python对象打交道而不是和数据库实体对象（tables、documents、query languages）打交道。

通常在选择数据库工具的时候都会有如下几个参考标准：

> - 易用性
>
> 数据库抽象层，又被称作object-relational mappers (ORMs) 或 object-document mappers (ODMs)，提供了从高级对象到低级数据库实体的直接转换，使用起来当然会更加方便。
>
> -  性能
>
> ORMs和ODMs把对象转化为数据库实体会有一些开销，但多数时候这个开销可以忽略不计的。通常来说，使用ORMs和ODMs带来的工作效能提升往往大于所带来的性能损耗，因此我们没有什么理由拒绝ORMs和ODMs。通常比较合理的做法是用数据库抽象层来做常用的操作，而只在某些需要特别优化的地方使用原生的数据库操作。
>
> - 可移植性
>
> 所选择的数据库在生产和部署环境下是否可用是一个必须考虑的因素，比如你想要把你的应用部署在云平台上，你当然应该首先知道该平台支持哪些数据库。
>
> ORMs和ODMs还能带来的其他一个便利。虽然多数数据库提供了一个抽象层，但是还有一些更高阶的抽象层提供了只用一套接口即可操作多种数据库的功能。最好的例子就是SQLAlchemy  ORM，它提供了一系列关系型数据库引擎的支持，比如MySQL、Postgres 和 SQLite。
>
> - Flask集成
>
> 尽管不是必须要求能和Flask集成，但是能和Flask集成意味着能为你省去你大量书写代码的时间  。
>
> 正是因为使用Flask集成的数据库引擎能简化配置和操作，你应该尽可能选择Flask扩展形式的数据库引擎包。选择Flask-SQLAlchemy作为数据库工具，它是一个基于SQLAlchemy的Flask扩展。

## Flask-SQLAlchemy

### 文档

[SQLAlchemy](https://www.osgeo.cn/sqlalchemy/)

[Flask-SQLAlchemy](http://www.pythondoc.com/flask-sqlalchemy/index.html)

>Flask-SQLAlchemy 是一个为您的 [Flask](http://flask.pocoo.org/) 应用增加 [SQLAlchemy](http://www.sqlalchemy.org/) 支持的扩展。它需要 SQLAlchemy 0.6 或者更高的版本。它致力于简化在 Flask 中 SQLAlchemy 的使用，提供了有用的默认值和额外的助手来更简单地完成常见任务。

### 安装使用

要使用这个orm框架很容易，仅需必要的连接数据库配置，和其他（非必须）对数据库等操作的配置等。

当然，首先是需要安装这个扩展

```bash
pip install flask_sqlalchemy
```

引入一个扩展，我们需要为我们的应用实例绑定这个扩展的实例。

比如：

```python
"""
/project
	/App/__init__.py
	config.py
"""
# 引入扩展
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# 引入配置
from config import config

app = Flask(__name__)

# 添加配置信息
app.config.from_object(config.get('development'))

# 创建数据库实例 db
db = SQLAlchemy(app)

```

让我们看看上面需要一些什么东西

1. 配置文件（包含应用的配置，即包含数据库配置）。
2. 应用实例。
3. 绑定应用，创建一个数据库实例。

做完这些我们就可以根据数据库设计建立我们的模型数据对象类。从而将对具体的数据库查询方法中抽离出更加高层的API进行使用了。

### 配置

可在config.py进行该orm的配置，而后从而覆盖默认的配置。

| `SQLALCHEMY_DATABASE_URI`        | 用于连接数据的数据库。例如：  `sqlite:////tmp/test.db` `mysql://username:password@server/db` |
| -------------------------------- | ------------------------------------------------------------ |
| `SQLALCHEMY_BINDS`               | 一个映射绑定 (bind) 键到 SQLAlchemy 连接 URIs 的字典。 更多的信息请参阅 [*绑定多个数据库*](http://www.pythondoc.com/flask-sqlalchemy/binds.html#binds)。 |
| `SQLALCHEMY_ECHO`                | 如果设置成 True，SQLAlchemy 将会记录所有 发到标准输出(stderr)的语句，这对调试很有帮助。 |
| `SQLALCHEMY_RECORD_QUERIES`      | 可以用于显式地禁用或者启用查询记录。查询记录 在调试或者测试模式下自动启用。更多信息请参阅 `get_debug_queries()`。 |
| `SQLALCHEMY_NATIVE_UNICODE`      | 可以用于显式地禁用支持原生的 unicode。这是 某些数据库适配器必须的（像在 Ubuntu 某些版本上的 PostgreSQL），当使用不合适的指定无编码的数据库 默认值时。 |
| `SQLALCHEMY_POOL_SIZE`           | 数据库连接池的大小。默认是数据库引擎的默认值 （通常是 5）。  |
| `SQLALCHEMY_POOL_TIMEOUT`        | 指定数据库连接池的超时时间。默认是 10。                      |
| `SQLALCHEMY_POOL_RECYCLE`        | 自动回收连接的秒数。这对 MySQL 是必须的，默认 情况下 MySQL 会自动移除闲置 8 小时或者以上的连接。 需要注意地是如果使用 MySQL 的话， Flask-SQLAlchemy 会自动地设置这个值为 2 小时。 |
| `SQLALCHEMY_MAX_OVERFLOW`        | 控制在连接池达到最大值后可以创建的连接数。当这些额外的 连接回收到连接池后将会被断开和抛弃。 |
| `SQLALCHEMY_TRACK_MODIFICATIONS` | 如果设置成 True (默认情况)，Flask-SQLAlchemy 将会追踪对象的修改并且发送信号。这需要额外的内存， 如果不必要的可以禁用它。 |

其中最常用到的是`SQLALCHEMY_DATABASE_URI`用以进行数据库的连接。

这里列一下一些数据库的连接：

```bash
# Postgres:
postgresql://scott:tiger@localhost/mydatabase

# MySQL:
mysql://scott:tiger@localhost/mydatabase

# Oracle:
oracle://scott:tiger@127.0.0.1:1521/sidname

# SQLite (注意开头的四个斜线):
sqlite:////absolute/path/to/foo.db
```

`mysql` 其实就是差不多跟下面这个一样：

```python
"""
	应用配置
	config.py
"""
import os
# 获取当前文件所在的路径
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    # flash需要设置密钥
    SECRET_KEY = os.urandom(24)
    """
        数据库连接配置
        格式为mysql +mysqlconnector: // 数据库用户名:密码@数据库地址:端口号/数据库名字？数据库格式
    """
    conn_type = 'mysql+mysqlconnector'
    user = 'root'
    password = '7845'
    host = 'localhost:3306'
    base_name = 'oneappflask'
    query = 'charset=utf8'

    SQLALCHEMY_DATABASE_URI = f'{conn_type}://{user}:{password}@{host}/{base_name}?{query}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:7845@localhost:3306/rp?charset=utf8'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}
```

主要就是，连接的数据库名+数据库连接驱动方式：//其他...

这里就仅放出我目前连接mysql没有问题的驱动

```bash
pip install mysql-connector==2.2.9
```

好像还有pymysql

```bash
pip install pymysql
```

### 映射数据库模型

不同于SQLAlchemy，类的部分属性是可选的。

模型类均要继承`db.Model`

#### 表名

比如表名无需再指定，可以自动为你生成。

生成方式为：类名（`CamelCase`）---> 表名：（`camel_case`）。

定义表名可以用：`__tablename__ = 'xxx'`

#### 列（表字段）

可按照数据库表字段类型设置模型类的属性。

以`db.Column('字段类型','**约束')`进行定义。

##### 类型

以下列举常用的`db.Column`字段类型（为字段的第一个参数）

```
Integer 		：整型int
String(size)	：有长度限制字符串，类似varchar(xxx)
Text			：较长的unicode文本
DateTime		: 时间和日期 （Python datetime 对象）
Float			：浮点数
Boolean			：布尔值
PickleType		：持久化 Python 对象
LargeBinary		：任意大的二进制数数据
...等等
```

##### 约束

```python
# 设置某一字段为主键 
primary_key = True 

# 唯一
unipue = True

# 自增
autoincrement = True

# 设置默认值
default = xxx

# 建立索引
index = True

# 设置为某一表的外键
db.ForeignKey('person.id')
```

#### 关系

是一种数据库实体之间的关系体现，并不是真的会在数据库进行这个字段的建立。

##### 一对多关系：

以`db.relationship('要与之关系的模型类名',backref='給前一个参数的模型类的引用',lazy='加载数据方式')`

`lazy`可选项：

```
select 		：(默认值) 就是说 SQLAlchemy 会使用一个标准的 select 语句必要时一次加载数据。
joined 		：告诉 SQLAlchemy 使用 JOIN 语句作为父级在同一查询中来加载关系。
subquery 	：类似 'joined' ，但是 SQLAlchemy 会使用子查询。
dynamic'	：在有多条数据的时候是特别有用的。不是直接加载这些数据，SQLAlchemy 会返回一个查询对象，在加载数据前您可以过滤（提取）它们。

通常我使用dynamic 返回一个查询对象，让我进行数据的进一步筛选
```

我们也设置反向引用的数据加载方式，以` backref=db.backref('pages', lazy='dynamic')`进行设置。

##### 多对多关系：

多对多我们需要一个中间表，而这个表不进行模型的映射，而是实际的表；

比如官方例子：

```python
tags = db.Table('tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
    db.Column('page_id', db.Integer, db.ForeignKey('page.id'))
)

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tags = db.relationship('Tag', secondary=tags,
        backref=db.backref('pages', lazy='dynamic'))

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
```

`sencondary`为关联表参数参数，即中间表 `tags`



#### 其他

构造函数：`__init__(self)`等

类似与java里实体类的`toString()`方法，打印出当前实例。我们可以使用`__repr__(self)`来进行模型数据的输出以便于我们测试。

```python
def __repr__(self):
    return f'article:{self.id},{self.title},{self.user_id}'
```

还有其他为该模型对象的值进行加密函数等，计算函数等自定义的函数或者属性。

### 模型示例

建立2个表分别存在，一对多的关系

```python
from . import db

class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(64))
    content = db.Column(db.String(1000))
    time = db.Column(db.DateTime,index=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer,db.ForeignKey('post.id'))
    comments = db.relationship('Comment',backref='comment_article',lazy='dynamic')

    def __repr__(self):
        return f'article:{self.id},{self.title},{self.user_id}'
    

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(64))
    content = db.Column(db.String(1000))
    comm_type = db.Column(db.SmallInteger,default=1)
    time = db.Column(db.DateTime,index=True)
    to_user_id = db.Column(db.Integer)
    form_user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    article_id = db.Column(db.Integer,db.ForeignKey('article.id'))

    def __repr__(self):
        return f'comment:{self.id},{self.title},{self.user_id}'
```

以上是文章表对应多个评论的关系。

使用的时候：

```python
article = Article()

# 此时可以获取该文章的所有评论,而comments并非真正的字段，只是便于查询。
# 为一个查询对象，我们可以对这个对象进行数据操作，比如获取总数 .count()
article.comments


# 而 对于 一个评论对象来说
comment = Comment()

# 获取该评论对应的文章所有的属性,利用反向引用的名称
# 可以获取到一个与lazy有关的数据对象？还是一个对象暂未测试
comment.comment_article

# 可以通过获取特定的文章信息，方便查询
comment.comment_article.属性

```

### 操作

#### 对数据库表的操作。

```python
# 表示创建定义模型中对应到数据库中的表
db.create_all()
# 表示删除数据库中的所有的表
db.drop_all()
```

#### 对数据库数据的操作。

>向数据库插入数据分为三个步骤:
>
>1. 创建 Python 对象
>2. 把它添加到会话
>3. 提交会话
>
>这里的会话不是 Flask 的会话，而是 Flask-SQLAlchemy 的会话。
>
>它本质上是一个 数据库事务的加强版本

假定拥有如下模型类：

```python
# user

class User(db.Model):
	id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(24))
```



##### 新增（insert）：

```python
# 单个
user = User(name='xxx')
try:
    # 选择add()添加入会话事务
    db.session.add(user)
    # 提交事务
    db.session.commit()
except:
    # 撤销事务
	db.session.rollback()

# 批量
user_list = []
for i in range(5):
	user = User(name=i)
    user_list.append(user)
try:
    # 选择add_all()添加入会话事务
    db.session.add_all(user_list)
    # 提交事务
    db.session.commit()
except:
    # 撤销事务
	db.session.rollback()
```

##### 删除（delete）

```python
user = User().query.get(id)
try:
    # 选择delete()添加入会话事务
    db.session.delete(user)
    # 提交事务
    db.session.commit()
except:
    # 撤销事务
	db.session.rollback()
```

##### 更新（update）

```python
user = User().query.get(id)
try:
    # 修改查询出来的对象属性
    user.name = 'xxx'
    # 直接提交事务即可
    db.session.commit()
except:
    # 撤销事务
	db.session.rollback()
```

##### 查询（select）

在`Model`类上提供了`query`属性用于返回一个查询对象。

比如：`User.query`得到的是一个`BaseQuery`对象。

对于这个对象我们有以下方法进行查询。

我们可以对这个查询对象做各种过滤查询，限制等来构造更为复杂的查询语句。

```python
# 以主键查询单个
User.query.get(id)
User.query.get_or_404(id)

# 查询全部，以list形式返回
User.query.all()

# 筛选数据，指定某些具体属性，获取查询集合
# 以sql expression 为参数
User.query.filter(User.name=='xxx').all()
# 以字段，多个字段为and关系
User.query.filter_by(name='xxx').all()


# 排序，默认升序asc(User.id)，降序desc(User.id)
order_by()

# 分组
group_by()
```

一些特殊的执行器：

```python
# 获取单个
get(id)
get_or_404(id)

# 全部
all()

# 第一个数据
first()
first_or_404()

# 结果数量
count()

# 偏移
offset(offset)

# 限制
limit(limit)

# 分页
paginate(page=None, per_page=None, error_out=True)
# 该分页执行器返回一个分页对象
{	
	items  		# 当前页中的记录
	query		# 分页的源查询
	page		# 当前页数
	prev_num	# 上一页页数
	next_num	# 下一页页数
	has_next	# 存在下一页返回True
	has_prev	# 存在上一页返回True
	pages		# 总页数
	per_page	# 每页显示记录数量即指定的分页大小
	total		# 总记录数
    iter_pages	# 遍历分页页码，默认显示4个页码超过的用None表示
    prev		# 返回上一页的pageinate 对象
    next		# 返回下一页的pageinate 对象
    
}
```

还有一些参数属性的选择来构建一些复杂的查询内容限制。比如包含啦，在什么之间啦，大小等的比较啦。

```bash
# 条件逻辑，条件格式：对象.属性 == 值

and_(条件1,条件2,...)

or_(条件1,条件2,...)

not_(条件1,条件2,...)

# 比如
filter(and_(条件1,条件2,...))

# 运算符，条件属性的一些比较
==、!=、<=、>=、>、<
contains	# 包含
startswith	# 以...开始
endswith	# 以...结束
in_			# 在什么范围内
like		# 模糊查询

# 比如

User.query.filter(User.id.in_([1,2,3]))

User.query.filter(User.name.contains('小明'))

User.query.filter(User.name.startswith('小'))

User.query.filter(User.name.endswith('明'))

# % 代表一个或者多个、_ 代表单个
User.query.filter(User.name.like('%明%'))
User.query.filter(User.name.like('_明_'))

```

1.  `filter`和`filter_by`的结果可遍历，使用`all()`方法将其转换成一个列表或者`first()`转换成对象。

2.  `all()`获得的是列表，列表没有`first()`方法

   我们需要将以上`BaseQuery`的方法进行结合使用，以达到我们需要的效果。
   
   如果有更为复杂的`sql`我们可以直接执行我们的`sql`语句来进行查询。

#### 分页，前端模版展示

​	{% raw %}

   ```jinja2
   {% macro render_pagination(pagination, endpoint) %}
     <div class=pagination>
     {%- for page in pagination.iter_pages() %}
       {% if page %}
         {% if page != pagination.page %}
           <a href="{{ url_for(endpoint, page=page) }}">{{ page }}</a>
         {% else %}
           <strong>{{ page }}</strong>
         {% endif %}
       {% else %}
         <span class=ellipsis>…</span>
       {% endif %}
     {%- endfor %}
     </div>
   {% endmacro %}
   ```

   {% endraw %}

## 结语

看完上述，我们就可以进行这个扩展的使用了，但是还有一些更好其他扩展配合使用，比如数据库迁移，和脚本命令行使用等。

总之就是需要我们灵活使用，灵活设计数据库，将实体关系什么的理清楚，毕竟一个系统什么的，还是数据库的实现最为大头之一。