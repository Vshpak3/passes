import { ApiProperty } from '@nestjs/swagger'

export class SolanaUSDCTransactionRequest {
  @ApiProperty()
  paymentId: string
  @ApiProperty()
  ownerAccount: string
}
