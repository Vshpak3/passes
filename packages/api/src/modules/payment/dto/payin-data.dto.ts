import { DtoProperty } from '../../../web/endpoint.web'

export class PayinDataDto {
  @DtoProperty()
  amount: number

  @DtoProperty({ required: false })
  target?: string

  @DtoProperty()
  blocked: boolean
}
