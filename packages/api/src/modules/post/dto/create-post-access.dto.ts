import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class CreatePostAccessDto {
  @ApiProperty()
  postId: string

  @ApiProperty()
  fromDM: boolean

  @ApiPropertyOptional()
  payinMethod?: PayinMethodDto
}
