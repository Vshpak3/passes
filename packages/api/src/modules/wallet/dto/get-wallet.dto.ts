import { DtoProperty } from '../../../web/dto.web'
import { WalletDto } from './wallet.dto'

export class GetWalletResponseDto extends WalletDto {}

export class GetWalletsResponseDto {
  @DtoProperty({ type: [WalletDto] })
  wallets: WalletDto[]

  constructor(wallets: WalletDto[]) {
    this.wallets = wallets
  }
}
