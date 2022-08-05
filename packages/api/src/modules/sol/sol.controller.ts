import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PublicKey } from '@solana/web3.js'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { CreateSolNftDto } from './dto/create-sol-nft.dto'
import { CreateSolNftCollectionDto } from './dto/create-sol-nft-collection.dto'
import { GetSolNftDto } from './dto/get-sol-nft.dto'
import { GetSolNftCollectionDto } from './dto/get-sol-nft-collection.dto'
import { SolService } from './sol.service'

@ApiTags('sol')
@Controller('sol')
export class SolController {
  constructor(private readonly solService: SolService) {}

  @ApiOperation({ summary: 'Creates Sol NFT Collection' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetSolNftCollectionDto,
    description: 'Sol NFT Collection was created',
  })
  @Post('nft_collection')
  @UseGuards(JwtAuthGuard)
  async createNftCollection(
    @Req() req: RequestWithUser,
    @Body() createSolNftCollectionDto: CreateSolNftCollectionDto,
  ): Promise<GetSolNftCollectionDto> {
    return await this.solService.createNftCollection(
      req.user.id,
      createSolNftCollectionDto.name,
      createSolNftCollectionDto.symbol,
      'test pass',
      '',
    )
  }

  @ApiOperation({ summary: 'Creates Sol NFT from Collection' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetSolNftDto,
    description: 'Sol NFT Collection was created',
  })
  @Post('nft')
  @UseGuards(JwtAuthGuard)
  async createNft(
    @Req() req: RequestWithUser,
    @Body() createSolNftDto: CreateSolNftDto,
  ): Promise<GetSolNftDto> {
    return await this.solService.createNftPass(
      req.user.id,
      new PublicKey(createSolNftDto.owner),
      createSolNftDto.collectionId,
    )
  }
}
