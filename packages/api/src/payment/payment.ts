import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';

@Entity()
export class Payment extends BaseEntity {
  
  @Property()
  email!: string;

  @Property()
  amount: number;

  @Property()
  currencyType: string;

  @Property()
  walletAddress: string;

  @Property()
  paymentInfo: string;

  @Property()
  recurring: boolean;

}
