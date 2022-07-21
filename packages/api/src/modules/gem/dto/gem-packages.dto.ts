import { ApiProperty } from '@nestjs/swagger'

import { GemPackageEntity } from '../entities/gem.package.entity'

// mirrors entity object
export class GemPackageEntityDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  cost: number

  @ApiProperty()
  baseGems: number

  @ApiProperty()
  bonusGems: number

  @ApiProperty()
  isPublic: boolean

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  constructor(gemPackageEntity?: GemPackageEntity) {
    if (gemPackageEntity !== undefined) {
      this.id = gemPackageEntity.id
      this.cost = gemPackageEntity.cost
      this.baseGems = gemPackageEntity.baseGems
      this.bonusGems = gemPackageEntity.bonusGems
      this.isPublic = gemPackageEntity.isPublic
      this.title = gemPackageEntity.title
      this.description = gemPackageEntity.description
    } else {
      this.id = ''
    }
  }
}
