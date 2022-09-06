import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class UserDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  email: string

  @DtoProperty()
  username: string

  @DtoProperty({ required: false })
  displayName?: string

  @DtoProperty({ required: false })
  isCreator?: boolean

  // Sensitive fields (when viewing own profile)
  @DtoProperty({ required: false })
  legalFullName?: string

  @DtoProperty({ required: false })
  phoneNumber?: string

  @DtoProperty({ required: false })
  birthday?: string

  @DtoProperty({ required: false })
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
