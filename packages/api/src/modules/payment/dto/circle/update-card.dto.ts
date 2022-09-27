import { DtoProperty } from '../../../../web/dto.web'

export class CircleUpdateCardDto {
  @DtoProperty({ type: 'uuid' })
  keyId: string

  @DtoProperty({ type: 'string' })
  encryptedData: string

  @DtoProperty({ type: 'number' })
  expMonth: number

  @DtoProperty({ type: 'number' })
  expYear: number
}
