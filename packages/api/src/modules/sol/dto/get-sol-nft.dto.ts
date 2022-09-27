import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { TRANSACTION_HASH_LENGTH } from '../../payment/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'

export class GetSolNftResponseDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  mintPubKey: string

  @Length(1, TRANSACTION_HASH_LENGTH)
  @DtoProperty({ type: 'string' })
  transactionHash: string
}
