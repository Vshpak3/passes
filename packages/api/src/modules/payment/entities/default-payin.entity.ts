import { Entity, Enum, OneToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { DefaultProviderDto } from '../dto/default-provider.dto'
import { ProviderAccountTypeEnum, ProviderEnum } from '../enum/provider.enum'

@Entity({ tableName: 'default_payin' })
export class DefaultPayinEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  @Unique()
  providerAccountId?: string

  //provider
  @Enum(() => ProviderEnum)
  provider: ProviderEnum

  @Enum(() => ProviderAccountTypeEnum)
  providerAccountType: ProviderAccountTypeEnum

  dto(): DefaultProviderDto {
    const dto = new DefaultProviderDto()
    dto.provider = this.provider
    dto.providerAccountType = this.providerAccountType
    dto.providerAccountId = this.providerAccountId
    return dto
  }
}
