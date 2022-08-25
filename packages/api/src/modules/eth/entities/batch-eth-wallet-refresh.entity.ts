import { Entity, Index } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { WalletEntity } from '../../wallet/entities/wallet.entity'

@Entity({ tableName: 'batch_eth_wallet_refresh' })
export class BatchEthWalletRefreshEntity extends BaseEntity {
  @Index()
  lastProcessedId?: WalletEntity
}
