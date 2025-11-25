import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { thucTap } from '../../entity/thuc-tap/thuc-tap.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class thucTapService extends BaseEntityService {
    constructor(@InjectRepository(thucTap) public entityRepository: Repository<thucTap>) {
        super(entityRepository);
    }
}
