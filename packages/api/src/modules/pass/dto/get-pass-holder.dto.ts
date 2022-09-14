import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PassHolderDto } from './pass-holder.dto'

export class GetPassHolderResponseDto extends PassHolderDto {}

export class GetPassHoldersResponseDto {
  @DtoProperty({ type: [PassHolderDto] })
  passHolders: PassHolderDto[]

  constructor(passHolders: PassHolderDto[]) {
    this.passHolders = passHolders
  }
}

export class GetPassHoldersRequestDto {
  // this is holder id if creator query
  // this is creator id if holder query
  @IsUUID()
  @DtoProperty({ optional: true })
  userId?: string

  @IsUUID()
  @DtoProperty({ optional: true })
  passId?: string
}
