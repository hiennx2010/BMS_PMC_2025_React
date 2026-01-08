import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntitiesMetadata } from '../../entity/entities-metadata/entities-metadata.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class EntitiesMetadataService extends BaseEntityService {
    constructor(@InjectRepository(EntitiesMetadata) public entityRepository: Repository<EntitiesMetadata>) {
        super(entityRepository);
    }
}
