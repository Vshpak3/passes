import { DtoProperty } from '../../../web/dto.web'

export class GetSolNftCollectionResponseDto {
  @DtoProperty()
  passPubKey: string

  @DtoProperty()
  transactionHash: string
}
