import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { CreateEthNftCollectionRequestDto } from './dto/create-eth-nft-collection.dto'
import { GetEthNftCollectionResponseDto } from './dto/get-eth-nft-collection.dto'
import { EthService } from './eth.service'

@ApiTags('eth')
@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @ApiEndpoint({
    summary: 'Creates ETH NFT Collection',
    responseStatus: HttpStatus.CREATED,
    responseType: GetEthNftCollectionResponseDto,
    responseDesc: 'ETH NFT Collection was created',
  })
  @Post('nftcollection')
  async createEthNftCollection(
    @Req() req: RequestWithUser,
    @Body() createEthNftCollectionDto: CreateEthNftCollectionRequestDto,
  ): Promise<GetEthNftCollectionResponseDto> {
    return await this.ethService.createEthNftCollection(
      req.user.id,
      createEthNftCollectionDto,
    )
  }
}
