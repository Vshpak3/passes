import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

export class GetUserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  userName: string

  @ApiProperty()
  fullName?: string

  @ApiProperty()
  phoneNumber?: string

  @ApiProperty()
  birthday?: string

  @ApiProperty()
  isCreator?: boolean

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id
    this.email = userEntity.email
    this.userName = userEntity.userName
    this.fullName = userEntity.fullName
    this.phoneNumber = userEntity.phoneNumber
    this.birthday = userEntity.birthday
    this.isCreator = userEntity.isCreator
  }
}
