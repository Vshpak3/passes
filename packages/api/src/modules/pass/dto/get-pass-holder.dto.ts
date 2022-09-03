import { ApiProperty } from '@nestjs/swagger'

import { PassHolderDto } from './pass-holder.dto'

export class GetPassHolderResponseDto extends PassHolderDto {}

export class GetPassHoldersResponseDto {
  @ApiProperty({ type: [PassHolderDto] })
  passHolders: PassHolderDto[]

  constructor(passHolders: PassHolderDto[]) {
    this.passHolders = passHolders
  }
}
