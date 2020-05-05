---
layout: post
title: Happybase 使用
date: 2020-05-05
author: 霁
header-img:
catalog: true
categories:
- 学习
- Python
tags:
- Python
- Hbase
---



### Happybase

[文档](https://happybase.readthedocs.io/en/latest/index.html)

### 准备工作

首先安装上，以下2个库

```bash
pip3 install happybase thrift
```

确保我们是Hbase是正常使用的。

```bash
cd /hbase-2.2.4
# 运行habse
./bin/start-hbase.sh

# shell 连接 habse
./bin/hbase shell

```

根据文档中的示例代码进行连接数据库

```python
import happybase

connection = happybase.Connection('hostname')
table = connection.table('table-name')

table.put(b'row-key', {b'family:qual1': b'value1',
                       b'family:qual2': b'value2'})

row = table.row(b'row-key')
print(row[b'family:qual1'])  # prints 'value1'

for key, data in table.rows([b'row-key-1', b'row-key-2']):
    print(key, data)  # prints row key and data for each row

for key, data in table.scan(row_prefix=b'row'):
    print(key, data)  # prints 'value1' and 'value2'

row = table.delete(b'row-key')
```

在上述准备工作都搞好之后，我们还需要打开我们的 `ThriftServer`默认的启动端口是9090。

```bash
./bin/hbase-daemon.sh start thrift
```

### Happybase 查询结果

由于我这个版本的happybase返回的结果都为字节串。

我需要将它们转化为utf-8的字符

```python
# 转换编码
def process_data(row):
    return {k.decode('utf-8'): v.decode('utf-8') for k, v in row.items()}
```

我们可以封装一些我们用得到的操作。

比如初始化数据等等呢个

```python
@app.route('/initData')
def initData():
    b = table.batch()
    try:
        for i in range(1000):
            b.put(f'rev_{i}',{'client_info:name':f'huawei_{i}','client_info:data':'xyz','client_info:sensor_data':'xxxx'})
    except ValueError as e:
        return 'init data fail'
    else:
        b.send()
    return 'init data success'

# 所有数据
@app.route('/scan')
def all_info():
    infos = {} 
    for k,v in table.scan():
        key = k.decode('utf-8')
        values = process_data(v)
        infos.setdefault(key,values)
    return infos
```

![YkcfnH.png](https://s1.ax1x.com/2020/05/06/YkcfnH.png)