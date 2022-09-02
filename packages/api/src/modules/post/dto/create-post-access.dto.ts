import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePostAccessRequestDto {
  @IsUUID()
  @ApiProperty()
  postId: string

  @ApiProperty()
  fromDM: boolean

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
