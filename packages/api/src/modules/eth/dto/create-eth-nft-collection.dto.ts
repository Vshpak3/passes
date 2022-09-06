import { DtoProperty } from '../../../web/dto.web'

export class CreateEthNftCollectionRequestDto {
  @DtoProperty()
  tokenAddress: string

  @DtoProperty()
  name: string
}
