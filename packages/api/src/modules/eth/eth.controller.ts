import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { CreateEthNftCollectionDto } from './dto/create-eth-nft-collection.dto'
import { EthNftCollectionDto } from './dto/eth-nft-collection.dto'
import { EthService } from './eth.service'

@ApiTags('eth')
@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @ApiOperation({ summary: 'Creates ETH NFT Collection' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateEthNftCollectionDto,
    description: 'ETH NFT Collection was created',
  })
  @Post('nftcollection')
  async createNftCollection(
    @Req() req: RequestWithUser,
    @Body() createEthNftCollectionDto: CreateEthNftCollectionDto,
  ): Promise<EthNftCollectionDto> {
    return new EthNftCollectionDto(
      await this.ethService.createNftCollection(
        req.user.id,
        createEthNftCollectionDto,
      ),
    )
  }
}
