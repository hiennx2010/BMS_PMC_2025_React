import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_domain_mapping' })
export class DomainMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false, name: 'first_domain' })
    firstDomain: string;

    @Index()
    @Column({ nullable: false, name: 'first_id' })
    firstId: string;

    @Index()
    @Column({ nullable: false, name: 'second_domain' })
    secondDomain: string;

    @Index()
    @Column({ nullable: false, name: 'second_id' })
    secondId: string;
}