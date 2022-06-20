import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class AccountSetting extends BaseEntity {
  @Property()
  userId: number

  @Property({ nullable: true })
  passId?: number

  @Property({ nullable: true })
  notificationsId?: number

  @Property()
  profileId: number

  @Property()
  isCreator: boolean
}
