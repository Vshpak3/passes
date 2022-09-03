import { ApiProperty } from '@nestjs/swagger'

export class VerifyEmailDto {
  @ApiProperty()
  verificationToken: string
}
