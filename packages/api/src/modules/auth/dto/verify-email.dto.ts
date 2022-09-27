import { DtoProperty } from '../../../web/dto.web'

export class VerifyEmailDto {
  @DtoProperty({ type: 'uuid' })
  verificationToken: string
}
