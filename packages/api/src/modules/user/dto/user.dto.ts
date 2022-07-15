import { ApiProperty } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

export class UserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  oauthId?: string

  @ApiProperty()
  oauthProvider?: string

  @ApiProperty()
  userName: string

  @ApiProperty()
  fullName?: string

  @ApiProperty()
  phoneNumber?: string

  @ApiProperty()
  birthday?: string

  @ApiProperty()
  isKYCVerified?: boolean

  @ApiProperty()
  isCreator?: boolean

  @ApiProperty()
  isDisabled?: boolean

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id
    this.email = userEntity.email
    this.oauthId = userEntity.oauthId
    this.oauthProvider = userEntity.oauthProvider
    this.userName = userEntity.userName
    this.fullName = userEntity.fullName
    this.phoneNumber = userEntity.phoneNumber
    this.birthday = userEntity.birthday
    this.isKYCVerified = userEntity.isKYCVerified
    this.isCreator = userEntity.isCreator
    this.isDisabled = userEntity.isDisabled
  }
}
