import { DtoProperty } from '../../../web/endpoint.web'

// this is a debug endpoint used for testing
export class CreateSolNftCollectionRequestDto {
  @DtoProperty()
  name: string

  @DtoProperty()
  symbol: string
}
