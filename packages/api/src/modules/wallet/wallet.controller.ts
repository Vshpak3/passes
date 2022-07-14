import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import dedent from 'dedent'
import * as uuid from 'uuid'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { EthService } from '../eth/eth.service'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { GetUserWalletsDto } from './dto/get-user-wallets.dto'
import { WalletResponseDto } from './dto/wallet-response.dto'
import { Chain } from './enum/chain.enum'
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthService,
  ) {}

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
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletService.create(req.user.id, createWalletDto)
    if (wallet.chain == Chain.ETH) {
      return this.ethService.refreshNftsForWallet(req.user.id, wallet.id)
    }
    return new WalletResponseDto(wallet)
  }

  @ApiOperation({ summary: 'Creates wallet auth message to sign' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthWalletResponseDto,
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
    type: GetUserWalletsDto,
    description: 'Wallets were retrieved',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser): Promise<GetUserWalletsDto> {
    const wallets = await this.walletService.getWalletsForUser(req.user.id)
    return new GetUserWalletsDto(wallets)
  }

  @ApiOperation({ summary: 'Refresh tokens owned by a wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WalletResponseDto,
    description: 'Wallet tokens were updated',
  })
  @Post('/refresh/:id')
  @UseGuards(JwtAuthGuard)
  async refresh(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<WalletResponseDto> {
    return this.ethService.refreshNftsForWallet(req.user.id, id)
  }
}
