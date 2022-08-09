import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'
import { GetUserDto } from './get-user.dto'

export class SearchCreatorResponseDto {
  @ApiProperty()
  creators: GetUserDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => new GetUserDto(c))
  }
}
