import { Entity, ManyToOne, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { AgencyEntity } from './agency.entity'

@Entity({ tableName: 'creator_agency' })
export class CreatorAgencyEntity extends BaseEntity {
  static table = 'creator_agency'

  @OneToOne(() => UserEntity)
  creator_id: string

  @ManyToOne(() => AgencyEntity)
  agency_id: string

  @Property({ type: types.float })
  rate: number
}
