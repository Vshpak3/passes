import { DtoProperty } from '../../../web/dto.web'

export class VerifyEmailDto {
  //TODO: add length validation
  @DtoProperty()
  verificationToken: string
}
