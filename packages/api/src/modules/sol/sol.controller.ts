import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { GetWalletResponseDto } from '../wallet/dto/get-wallet.dto'
import { WalletService } from '../wallet/wallet.service'
import { CreateSolNftRequestDto } from './dto/create-sol-nft.dto'
import { CreateSolNftCollectionRequestDto } from './dto/create-sol-nft-collection.dto'
import { GetSolNftResponseDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionResponseDto } from './dto/get-sol-nft-collection.dto'
import { SolService } from './sol.service'

@ApiTags('sol')
@Controller('sol')
export class SolController {
  constructor(
    private readonly walletService: WalletService,
    private readonly solService: SolService,
  ) {}

  @ApiEndpoint({
    summary: 'Creates Sol NFT Collection',
    responseStatus: HttpStatus.CREATED,
    responseType: GetSolNftCollectionResponseDto,
    responseDesc: 'Sol NFT Collection was created',
  })
  @Post('nft_collection')
  async createSolNftCollection(
    @Req() req: RequestWithUser,
    @Body() createSolNftCollectionDto: CreateSolNftCollectionRequestDto,
  ): Promise<GetSolNftCollectionResponseDto> {
    return await this.solService.createSolNftCollection(
      req.user.id,
      createSolNftCollectionDto.name,
      createSolNftCollectionDto.symbol,
      'test pass',
      '',
    )
  }

  @ApiEndpoint({
    summary: 'Creates Sol NFT from Collection',
    responseStatus: HttpStatus.CREATED,
    responseType: GetSolNftResponseDto,
    responseDesc: 'Sol NFT Collection was created',
  })
  @Post('nft')
  async createNft(
    @Req() req: RequestWithUser,
    @Body() createSolNftDto: CreateSolNftRequestDto,
  ): Promise<GetWalletResponseDto> {
    const wallet = await this.walletService.findWallet(createSolNftDto.walletId)
    if (!wallet) {
      throw new NotFoundException('wallet not found')
    }
    return wallet
  }
}
