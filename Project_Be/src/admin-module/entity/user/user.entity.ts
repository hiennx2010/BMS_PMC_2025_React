import { hashSync } from 'bcryptjs';
import { Entity, Column, BeforeInsert, BeforeUpdate, Index, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Personal } from '../personal/personal.entity';
import { Role } from '../role/role.entity';
import { SignedBaseEntity } from 'src/common-module/entity/base/signed-base.entity';
import { FieldsToSign } from 'src/common-module/decorator/entity/sign.field.decorator';

@FieldsToSign('username', 'password', 'createdAt', 'updatedAt', 'account_expired', 'account_locked', 'password_expired')
@Entity({ name: 'tbl_user' })
export class User extends SignedBaseEntity {

    @Index({ unique: true })
    @Column({ nullable: false, })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, default: true })
    enabled: boolean = true;

    @Column({ nullable: false, default: false, name: 'account_expired' })
    accountExpired: boolean = false;

    @Column({ nullable: false, default: false, name: 'account_locked' })
    accountLocked: boolean = false;

    @Column({ nullable: false, default: false, name: 'password_expired' })
    passwordExpired: boolean = false;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'tbl_user_role',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[]

    @OneToOne(() => Personal, (personal) => personal.user)
    personal: Personal;

    @BeforeInsert()
    async beforeInsert() {
        this.password = `{bcrypt}${hashSync(this.password, 10)}`;
        await super.beforeInsert();
    }

    @BeforeUpdate()
    async beforeUpdate() {
        if (this.password) {
            if (!this.password.startsWith('{bcrypt}')) {
                this.password = `{bcrypt}${hashSync(this.password, 10)}`
            } else {
                this.password = undefined
            }
        }
        await super.beforeUpdate();
    }
}