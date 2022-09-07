import { DtoProperty } from '../../../web/dto.web'

export class GetSolNftResponseDto {
  @DtoProperty()
  mintPubKey: string

  @DtoProperty()
  transactionHash: string
}
