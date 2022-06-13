import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base/base-entity';

@Entity()
export class AccountSettings extends BaseEntity {
    @Property()
    accountId: string;

    @Property()
    userId: string;
}