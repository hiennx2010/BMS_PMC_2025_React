import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { EntitiesMetadata } from '../entities-metadata/entities-metadata.entity';

@Entity({ name: 'tbl_entities' })
export class Entities extends BaseEntity {
    @Index({ unique: false })
    @Column({ length: 32, nullable: false })
    type: string;

    @Index({ unique: false })
    @Column({ name: 'sub_type', length: 32, nullable: false })
    subType: string;

    @Index({ unique: false })
    @Column({ name: 'owner_uuid', length: 64, nullable: false })
    ownerUuid: string;

    @OneToOne(() => EntitiesMetadata, (em) => em.entity)
    data: EntitiesMetadata;
}