import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { Entities } from '../entities/entities.entity';

@Entity({ name: 'tbl_entities_metadata' })
export class EntitiesMetadata extends BaseEntity {
    @OneToOne(() => Entities, (e) => e.data)
    @JoinColumn({ name: 'uuid', referencedColumnName: 'uuid' })
    entity: Entities;

    @Column({ nullable: true })
    value: string;
}