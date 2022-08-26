import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'
import { GetUserResponseDto } from './get-user.dto'

export class SearchCreatorRequestDto {
  @ApiProperty()
  query: string
}

export class SearchCreatorResponseDto {
  @ApiProperty()
  creators: GetUserResponseDto[]

  constructor(creators: UserEntity[]) {
    this.creators = creators.map((c) => new GetUserResponseDto(c))
  }
}
