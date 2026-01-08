import { Entity, Column } from 'typeorm';
import { SignedBaseEntity } from 'src/common-module/entity/base/signed-base.entity';
import { FieldsToSign } from 'src/common-module/decorator/entity/sign.field.decorator';

@FieldsToSign('config_attributes', 'http_method', 'url', 'active')
@Entity({ name: 'tbl_request_map' })
export class RequestMap extends SignedBaseEntity {
    @Column({ nullable: false, name: 'config_attributes' })
    configAttributes: ConfigAttributeEnum | string;

    @Column({ nullable: true, name: 'http_method', length: 16 })
    httpMethod: string;

    @Column({ nullable: false, })
    url: string;

    @Column({ nullable: true })
    active: boolean = true;

    @Column({name: "log_body", nullable: true})
    logBody: boolean = false
}

export enum ConfigAttributeEnum {
    denyAll = 'denyAll',
    isAuthenticated = 'isAuthenticated()',
    permitAll = 'permitAll',
}