## 1. Các package cần cài đặt

- install

``` bash
npm install redis
```

- file package.json:

```
```

- file .env

```
# Tham so cau hinh cho cache redis module ================================
cache.redis.host=
cache.redis.port=
cache.redis.db=
# Tham so cau hinh cho cache redis module ================================
```

- module cần khai báo trước

```
```

## 2. Cách sử dụng

- Khai báo module trong app.module.ts
- Lưu ý: Hiện tại cache-manager chỉ tương thích với bản cache-manager-redis-store@2.0.0, từ bản cache-manager-redis-store@3.x.x đang không xử lý được ttl
