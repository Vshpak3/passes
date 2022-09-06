import { IsInt, IsOptional, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { PassTypeEnum } from '../enum/pass.enum'

export class CreatePassRequestDto {
  @DtoProperty()
  @Length(1, 100)
  title: string

  @DtoProperty()
  @Length(1, 400)
  description: string

  @DtoProperty()
  type: PassTypeEnum

  @DtoProperty()
  @IsInt()
  @Min(0)
  price: number

  @DtoProperty()
  @IsInt()
  @Min(1)
  totalSupply: number

  @DtoProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number

  @DtoProperty({ required: false })
  freetrial: boolean

  @DtoProperty({ required: false })
  messages?: number | null
}
