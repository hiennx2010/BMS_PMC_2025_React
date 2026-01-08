## 1. Các package cần cài đặt

- install

``` bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

- file package.json:

```
  "dependencies": {
    ...
    "@aws-sdk/client-s3": "^3.388.0",
    "@aws-sdk/s3-request-presigner": "^3.388.0",
    ...
```

- file .env

```
# Tham số cấu hình cho s3 module =========================================
s3.access-key-id=
s3.secret-access-key=
s3.region=ap-southeast-1
s3.endpoint=
s3.bucket.name=
# Tham số cấu hình cho s3 module =========================================
```

- module cần khai báo trước

```
app-module, common-module
```

## 2. Cách sử dụng
- Khai báo module trong app.module.ts