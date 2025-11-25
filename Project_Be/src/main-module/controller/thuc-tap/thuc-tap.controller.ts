import { Controller } from '@nestjs/common';
import { thucTapService } from '../../service/thuc-tap/thuc-tap.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/thuc-tap')
export class thucTapController extends BaseEntityController {
    constructor(public entityService: thucTapService) {
        super(entityService)
    }
}
