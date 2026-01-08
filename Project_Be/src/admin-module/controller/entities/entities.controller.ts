import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { EntitiesService } from '../../service/entities/entities.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { GeneralResponse, GeneralResponseErrorDetail } from 'src/common-module/dto/general-response.dto';
import { Request, Response } from 'express';
import { EntitiesMetadata } from 'src/admin-module/entity/entities-metadata/entities-metadata.entity';

@Controller('/api/v1/entities')
export class EntitiesController extends BaseEntityController {
    constructor(public entityService: EntitiesService) {
        super(entityService);
    }

    @Get('/get-more-params')
    async getMoreParams(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        try {
            let items: any = await this.entityService.getMoreParams([req.query['ownerUuid']], req.query['type']?.toString());
            return items.map((item: EntitiesMetadata) => {
                let __item: any = this.entityService.modifyData(item, this.__getExcludeKeys);
                __item.entity = this.entityService.modifyData(item.entity, this.__getExcludeKeys);
                return __item;
            });
        } catch (e) {
            let generalResponse = GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return generalResponse
        }
    }
}
