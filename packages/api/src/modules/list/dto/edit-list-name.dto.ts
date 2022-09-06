import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class EditListNameRequestDto {
  @IsUUID()
  @ApiProperty()
  listId: string

  @ApiProperty()
  name: string
}
