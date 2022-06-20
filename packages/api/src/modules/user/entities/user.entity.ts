import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity()
export class User extends BaseEntity {
  @Property()
  email!: string

  @Property()
  isKYCVerified: boolean = false

  @Property()
  walletAddress: string

  @Property()
  firstName: string

  @Property()
  lastName: string

  @Property({ nullable: true })
  userName: string

  @Property()
  passwordHash: string

  @Property()
  profileId: number

  @Property()
  lastLogin: Date = new Date()

  @Property()
  phoneNumber: string

  @Property()
  paymentId: number
}
