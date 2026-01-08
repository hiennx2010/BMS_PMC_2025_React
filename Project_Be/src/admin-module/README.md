## 1. Các package cần cài đặt

- install

``` bash
npm i @types/bcryptjs --save-dev
npm i bcryptjs
```

- file package.json:

```
...
"dependencies": {
    ...
    "axios": "^1.2.1",
    ...
},
...
```

- file .env

```
# Tham so cau hinh cho admin module ======================================
# Cho phép log thời gian thực thi API, mặc định false
interceptor.request-duration.enabled=true
# Tham so cau hinh cho admin module ======================================
```

- module cần khai báo trước

```
common-module
```

## 2. Cách sử dụng

- Khai báo module trong app.module.ts
