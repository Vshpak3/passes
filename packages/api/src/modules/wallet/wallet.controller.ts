import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import dedent from 'dedent'
import * as uuid from 'uuid'

import { RequestWithUser } from '../../types'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { WalletEntity } from './entities/wallet.entity'
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Creates authenticated wallet for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateWalletDto,
    description: 'Wallet was created',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    return this.walletService.create(req.user.id, createWalletDto)
  }

  @ApiOperation({ summary: 'Creates wallet auth message to sign' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthWalletRequestDto,
    description: 'Wallet Auth Message created',
  })
  @UseGuards(JwtAuthGuard)
  @Post('auth')
  async auth(
    @Body() authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    const message = dedent`Click to verify your wallet with Moment

    This request will not trigger a blockchain transaction or cost any gas fees.

    Wallet address:
    ${authWalletRequestDto.walletAddress}

    Nonce:
    ${uuid.v4()}`
    return {
      rawMessage: message,
      chain: authWalletRequestDto.chain,
      walletAddress: authWalletRequestDto.walletAddress,
    }
  }

  @ApiOperation({ summary: 'Get wallets for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateWalletDto,
    description: 'Wallets were retrieved',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser): Promise<WalletEntity[]> {
    return this.walletService.getWalletsForUser(req.user.id)
  }
}
