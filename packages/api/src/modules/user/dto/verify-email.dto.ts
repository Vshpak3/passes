import { DtoProperty } from '../../../web/dto.web'

export class VerifyEmailDto {
  @DtoProperty()
  verificationToken: string
}
