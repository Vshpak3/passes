import { Entity, Index, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftEntity } from './sol-nft.entity'

@Entity({ tableName: 'batch_sol_nft_refresh' })
export class BatchSolNftRefreshEntity extends BaseEntity {
  @Index()
  @Property()
  lastProcessedId?: SolNftEntity
}
