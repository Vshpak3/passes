import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UserDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiPropertyOptional()
  displayName?: string

  @ApiPropertyOptional()
  isCreator?: boolean

  // Sensitive fields (when viewing own profile)
  @ApiPropertyOptional()
  legalFullName?: string

  @ApiPropertyOptional()
  phoneNumber?: string

  @ApiPropertyOptional()
  birthday?: string

  @ApiPropertyOptional()
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
