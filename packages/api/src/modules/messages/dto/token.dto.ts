import { DtoProperty } from '../../../web/dto.web'

export class TokenResponseDto {
  @DtoProperty({ type: 'string' })
  token: string
}
