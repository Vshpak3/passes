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
