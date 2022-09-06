import { DtoProperty } from '../../../web/endpoint.web'
import { EthNftDto } from '../../eth/dto/eth-nft.dto'
import { EthNftEntity } from '../../eth/entities/eth-nft.entity'
import { WalletDto } from './wallet.dto'

// TODO: refactor with new eth refresh
export class WalletResponseDto {
  @DtoProperty()
  wallet: WalletDto

  @DtoProperty()
  ethNfts: EthNftDto[]

  constructor(wallet: WalletDto, ethNfts: EthNftEntity[] = []) {
    this.wallet = wallet
    this.ethNfts = ethNfts.map(
      (ethNft) => new EthNftDto(ethNft, ethNft.ethNftCollection),
    )
  }
}
