import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

/**
 * this table contains internal and programmatic consistency of gem packages
 * when we recieve a payment, the current active (isActive = true) package with the HIGHEST SUM of gems
 * for the cost is selected
 *
 * TODO: give people access to special packages (e.g. coupons)
 * most likely requires another table
 */
@Entity({ tableName: 'gem_package' })
export class GemPackageEntity extends BaseEntity {
  @Property()
  cost: number

  @Property()
  baseGems: number

  @Property()
  bonusGems: number

  @Property()
  isPublic: boolean

  @Property()
  isActive: boolean

  @Property()
  title: string

  @Property()
  description: string
}
