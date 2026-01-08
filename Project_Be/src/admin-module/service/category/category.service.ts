import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entity/category/category.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { CategoryData } from 'src/admin-module/entity/category-data/category-data.entity';
import { CacheUtils } from 'src/common-module/utils/cache/cache.utils';
import * as _ from 'lodash';

@Injectable()
export class CategoryService extends BaseEntityService {
    private readonly log: Logger = new Logger(CategoryService.name);

    constructor(@InjectRepository(Category) public entityRepository: Repository<Category>,
        @InjectRepository(CategoryData) public categoryDataRepository: Repository<CategoryData>) {
        super(entityRepository);
    }

    getCategoryData(code: string, categoryDataCode?: string): Promise<any> {
        let __whereClause: string
        let __whereParams: any = {}
        if (categoryDataCode) {
            __whereClause = `category.code = :code and categoryData.code = :categoryDataCode`
            __whereParams = { categoryDataCode: categoryDataCode, code: code }
        } else {
            __whereClause = `category.code = :code`
            __whereParams = { code: code }
        }
        return new Promise((resolve, reject) => {
            this.categoryDataRepository.createQueryBuilder('categoryData')
                .leftJoinAndSelect('categoryData.category', 'category')
                .where(__whereClause, __whereParams).getMany().then((items) => {
                    resolve(items)
                }).catch((e) => {
                    reject(e)
                })
        })
    }

    public async getCategoryDataCached(code: string, categoryDataCode: string, defaultValue?: any): Promise<any> {
        let key: string = `category-data:${code}:${categoryDataCode}`;
        let value: any = await CacheUtils.getCacheAdapter().wrap(key, async () => {
            this.log.log(`calc ${key}...`);

            let cd: any = (await this.getCategoryData(code, categoryDataCode)).at(0);
            let __value: any = cd?.value;

            if (__value === undefined) return defaultValue;
            if (_.isNumber(defaultValue)) {
                __value = parseFloat(cd.value);
            } else if (_.isBoolean(defaultValue)) {
                __value = cd.value == 1 || cd.value == 'true';
            }

            return __value;
        }, 30000);
        return value;
    }
}
