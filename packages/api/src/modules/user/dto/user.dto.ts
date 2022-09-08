import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class UserDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @DtoProperty()
  email: string

  @DtoProperty()
  isEmailVerified?: boolean

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

  constructor(userEntity) {
    console.log(userEntity)
    this.id = userEntity.id
    this.email = userEntity.email
    this.isEmailVerified = userEntity.is_email_verified
    this.username = userEntity.username
    this.displayName = userEntity.display_name
    this.isCreator = userEntity.is_creator
    this.legalFullName = userEntity.legal_full_name
    this.phoneNumber = userEntity.phone_number
    this.birthday = userEntity.birthday
    this.countryCode = userEntity.country_code
  }

  override(init?: Partial<UserDto>): this {
    Object.assign(this, init)
    return this
  }
}
