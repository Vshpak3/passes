import { ApiProperty } from '@nestjs/swagger'

import { EthNftDto } from '../../eth/dto/eth-nft.dto'
import { EthNftEntity } from '../../eth/entities/eth-nft.entity'
import { WalletEntity } from '../entities/wallet.entity'
import { WalletDto } from './wallet.dto'

// TODO: refactor with new eth refresh
export class WalletResponseDto {
  @ApiProperty()
  wallet: WalletDto

  @ApiProperty()
  ethNfts: EthNftDto[]

  constructor(wallet: WalletEntity, ethNfts: EthNftEntity[] = []) {
    this.wallet = new WalletDto(wallet)
    this.ethNfts = ethNfts.map(
      (ethNft) => new EthNftDto(ethNft, ethNft.ethNftCollection),
    )
  }
}
