## Custom Command
```bash
# add entity
$ node ./generate.js entity <EntityName> --src=<folder_path>

# add service
$ node ./generate.js service <EntityName> --src=<folder_path>

# add controller
$ node ./generate.js controller <EntityName> --src=<folder_path>

# add all
$ node ./generate.js all <EntityName> --src=<folder_path>

# eg
$ node ./generate.js all Transaction --src=./src/admin-module
```

## Cấu hình multi datasource
### app.module.ts:
- Lưu ý từ datasource thứ 2 cần cung cấp **name**
```
...

### *.module.ts
- Tại các Module có sử dụng Multi Datasource
```
...
imports: [
  ...
  TypeOrmModule.forFeature([<Tên_Entity>], '<Tên_Datasource>'),
...
```
### *.service.ts
- Tại các Provider có sử dụng Repository cho Entity
```
...
constructor(@InjectRepository(<Tên_Entity>, '<Tên_Datasource>') public entityRepository: Repository<<Tên_Entity>>) {
        super(entityRepository);
    }
...
```
