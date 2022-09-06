import { DtoProperty } from '../../../web/endpoint.web'

export class CreateEthNftCollectionRequestDto {
  @DtoProperty()
  tokenAddress: string

  @DtoProperty()
  name: string
}
