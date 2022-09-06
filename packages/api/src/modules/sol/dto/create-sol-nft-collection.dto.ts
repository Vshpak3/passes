import { DtoProperty } from '../../../web/dto.web'

// this is a debug endpoint used for testing
export class CreateSolNftCollectionRequestDto {
  @DtoProperty()
  name: string

  @DtoProperty()
  symbol: string
}
