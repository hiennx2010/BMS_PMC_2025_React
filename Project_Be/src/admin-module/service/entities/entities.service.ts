import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Entities } from '../../entity/entities/entities.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import * as _ from 'lodash';
import { EntitiesMetadata } from 'src/admin-module/entity/entities-metadata/entities-metadata.entity';
import { EntitiesMetadataService } from '../entities-metadata/entities-metadata.service';

@Injectable()
export class EntitiesService extends BaseEntityService {
    constructor(@InjectRepository(Entities) public entityRepository: Repository<Entities>,
        private entitiesMetadataService: EntitiesMetadataService) {
        super(entityRepository);
    }

    /**
     * Thêm/Cập nhật các trường thông tin cho trong tbl_entities & tbl_entities_metadata
     * @param ownerUuid 
     * @param params 
     */
    async addMoreParams(ownerUuid: string, type: string, params: Record<string, any>) {
        let keys: string[] = Object.keys(params);
        let oems: EntitiesMetadata[] = await this.getMoreParams([ownerUuid], type, keys);

        let __currentTime = new Date();
        for (let idx = 0; idx < keys.length; idx++) {
            let key: string = keys.at(idx);
            let val: any = params[key];

            if (val === undefined || val === null) {
                continue;
            }

            let updateItem = oems.find((it: EntitiesMetadata) => { return it.entity.subType === key; });
            if (updateItem) {
                /**
                 * Cập nhật bản ghi đã có
                 */
                updateItem.entity.updatedAt = __currentTime;
                await this.entityRepository.save(updateItem.entity);

                updateItem.value = val;
                await this.entitiesMetadataService.save(updateItem);

                continue;
            }

            /**
             * Thêm bản ghi mới
             */
            let e: Entities = new Entities();
            e.type = type;
            e.ownerUuid = ownerUuid;
            e.subType = key;
            e = await this.entityRepository.save(e, { reload: true });

            let em: EntitiesMetadata = new EntitiesMetadata();
            em.value = val;
            em.entity = e;
            await this.entitiesMetadataService.save(em);
        }
    }

    /**
     * Lấy giá trị các field mở rộng của object trong tbl_entities & tbl_entities_metadata
     * @param ownerUuids 
     * @param paramNames 
     * @returns 
     */
    async getMoreParams(ownerUuids: any[], type: string, paramNames?: string[]): Promise<EntitiesMetadata[]> {
        let rs: EntitiesMetadata[] = await this.entitiesMetadataService.entityRepository.find({
            where: {
                entity: {
                    ownerUuid: In(ownerUuids),
                    type: type,
                    subType: paramNames?.length > 0 ? In(paramNames) : undefined
                }
            },
            relations: {
                entity: true
            }
        })
        return rs;
    }

    /**
     * Xóa các field mở rộng
     * @param ownerUuids 
     * @param type 
     * @param paramNames 
     */
    async deleteParams(ownerUuids: any[], type: string, paramNames?: string[]): Promise<any> {
        if (_.isEmpty(ownerUuids)) return;

        await this.entitiesMetadataService.entityRepository.delete({
            entity: {
                ownerUuid: In(ownerUuids),
                type: type,
                subType: paramNames?.length > 0 ? In(paramNames) : undefined
            }
        });

        await this.entityRepository.delete({
            ownerUuid: In(ownerUuids),
            type: type,
            subType: paramNames?.length > 0 ? In(paramNames) : undefined
        });
    }
}
