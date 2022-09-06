import { DtoProperty } from '../../../web/endpoint.web'

export class VerifyEmailDto {
  @DtoProperty()
  verificationToken: string
}
