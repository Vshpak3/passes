import { ApiProperty } from '@nestjs/swagger'

import { EthNftDto } from '../../eth/dto/eth-nft.dto'
import { EthNftEntity } from '../../eth/entities/eth-nft.entity'
import { WalletDto } from './wallet.dto'

// TODO: refactor with new eth refresh
export class WalletResponseDto {
  @ApiProperty()
  wallet: WalletDto

  @ApiProperty()
  ethNfts: EthNftDto[]

  constructor(wallet: WalletDto, ethNfts: EthNftEntity[] = []) {
    this.wallet = wallet
    this.ethNfts = ethNfts.map(
      (ethNft) => new EthNftDto(ethNft, ethNft.ethNftCollection),
    )
  }
}
