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
  displayName?: string

  @ApiProperty()
  isCreator?: boolean

  // Sensitive fields (when viewing own profile)
  @ApiProperty()
  legalFullName?: string

  @ApiProperty()
  phoneNumber?: string

  @ApiProperty()
  birthday?: string

  constructor(userEntity: UserEntity, includeSensitiveFields = false) {
    this.id = userEntity.id
    this.email = userEntity.email
    this.userName = userEntity.userName
    this.displayName = userEntity.displayName
    this.isCreator = userEntity.isCreator

    if (includeSensitiveFields) {
      this.legalFullName = userEntity.legalFullName
      this.phoneNumber = userEntity.phoneNumber
      this.birthday = userEntity.birthday
    }
  }
}
