import { Controller } from '@nestjs/common';
import { EntitiesMetadataService } from '../../service/entities-metadata/entities-metadata.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/entities-metadata')
export class EntitiesMetadataController extends BaseEntityController {
    constructor(public entityService: EntitiesMetadataService) {
        super(entityService)
    }
}
