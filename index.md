---
layout: page
showtag:
  - 日常
  - JavaScript
  - python
  - Mysql
  - java
  - Linux
  - 娱乐
  - 游戏
---
{% for tag in page.showtag %}

## {{ tag }}
<ul>
{% for post in site.tags[tag] %}
  <li class="tags-list">
    <a href={{ post.url }}>{{ post.title }}</a>
  </li>

{% if post.description %}

  > {{ post.description }}

{% endif %}

{% endfor %}
</ul>
{% endfor %}

## 近期

{% for post in site.posts limit:5 %}

- [{{ post.title }}]({{ post.url }}), *{{ post.date | date_to_string }}*

{% if post.description %}

  > {{ post.description }}

{% endif %}

{% endfor %}

- [更多…](/archive)


