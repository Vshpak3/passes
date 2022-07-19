import { ApiProperty } from '@nestjs/swagger'

// mirrors entity object
export class GemPackageEntityDto {
  @ApiProperty()
  cost: number

  @ApiProperty()
  base_gems: number

  @ApiProperty()
  bonus_gems: number

  @ApiProperty()
  isPublic: boolean

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string
}

export class GemPackagesDto {
  @ApiProperty({ type: [GemPackageEntityDto] })
  packages: Array<GemPackageEntityDto>
}
