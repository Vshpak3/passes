import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UserDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

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

  @ApiProperty()
  countryCode?: string

  constructor(userEntity, includeSensitiveFields = false) {
    this.id = userEntity.id
    this.email = userEntity.email
    this.username = userEntity.username
    this.displayName = userEntity.display_name
    this.isCreator = userEntity.is_creator

    if (includeSensitiveFields) {
      this.legalFullName = userEntity.legal_full_name
      this.phoneNumber = userEntity.phone_number
      this.birthday = userEntity.birthday
      this.countryCode = userEntity.country_code
    }
  }
}
