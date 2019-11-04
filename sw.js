const APP_PREFIX = 'XTRUET';

const VERSION = 'v_3.0.1';

const CACHE_NAME = APP_PREFIX + VERSION;

const URLS = [
  '/index.html',
  '/public/css/style.css',
  '/public/js/toc.js',
  '/public/js/prism.js',
  '/public/image/alipay.png',
  '/public/image/wechatpay.png',
  '/public/image/404.jpg',
  '/public/simple-jekyll-search/search.json',
  'https://ae01.alicdn.com/kf/Hb70dbc4687de416199bb2b295704957f0.png'
]

// 缓存资源

self.addEventListener('install',(e)=>{
  // 等待promise完成标记安装状态为完成安装
  e.waitUntil(
    // 打开一个缓存对象
    caches.open(CACHE_NAME).then((cache)=>{
      console.log(`install:${CACHE_NAME}`);
      // 以url为key,内容为value
      return cache.addAll(URLS);
    }).then(()=>self.skipWaiting())
  );
});

// 拦截请求

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function() {
      return fetch(event.request.url).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request.url, response.clone());
          return response;
        });  
      });
    }).catch(function() {
      return caches.match('/public/image/404.jpg');
    })
  );
});


// 移除旧缓存

self.addEventListener('activate',(e)=>{
  e.waitUntil(
    caches.keys().then((keys)=>{
      var cacheWhitelist = keys.filter((key)=>key.indexOf(APP_PREFIX));
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keys.map((key,i)=>{
        if(cacheWhitelist.indexOf(key) === -1){
            console.log(`delete cache:${keys[i]}`);
            return caches.delete(keys[i]);
        }
      }));
    }).then(()=>clients.claim())// 更新客户端
  );
})

