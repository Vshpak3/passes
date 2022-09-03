import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { EthService } from '../eth/eth.service'
import { AuthWalletRequestDto } from './dto/auth-wallet-request.dto'
import { AuthWalletResponseDto } from './dto/auth-wallet-response.dto'
import {
  CreateUnauthenticatedWalletRequestDto,
  CreateWalletRequestDto,
} from './dto/create-wallet.dto'
import {
  GetWalletResponseDto,
  GetWalletsResponseDto,
} from './dto/get-wallet.dto'
import { WalletResponseDto } from './dto/wallet-response.dto'
import { ChainEnum } from './enum/chain.enum'
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthService,
  ) {}

  @ApiOperation({ summary: 'Get user custodial wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetWalletResponseDto,
    description: 'User custodial wallet returned',
  })
  @Get('/custodial')
  async getUserCustodialWallet(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getUserCustodialWallet(req.user.id)
  }

  @ApiOperation({ summary: 'Get default wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetWalletResponseDto,
    description: 'Default wallet returned',
  })
  @Get('/default')
  async getDefaultWallet(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getDefaultWallet(req.user.id)
  }

  @ApiOperation({ summary: 'Set default wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Default wallet set',
  })
  @Post('default/:walletId')
  async setDefaultWallet(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<void> {
    await this.walletService.setDefaultWallet(req.user.id, walletId)
  }

  @ApiOperation({ summary: 'Creates authenticated wallet for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateWalletRequestDto,
    description: 'Wallet was created',
  })
  @Post()
  async createWallet(
    @Req() req: RequestWithUser,
    @Body() createWalletDto: CreateWalletRequestDto,
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletService.createWallet(
      req.user.id,
      createWalletDto,
    )
    if (wallet.chain == ChainEnum.ETH) {
      return this.ethService.refreshNftsForWallet(req.user.id, wallet.id)
    }
    return new WalletResponseDto(wallet)
  }

  @ApiOperation({ summary: 'Removes authenticated wallet for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet was deleted',
  })
  @Delete(':walletId')
  async removeWallet(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<boolean> {
    return this.walletService.removeWallet(req.user.id, walletId)
  }

  @ApiOperation({ summary: 'Creates wallet auth message to sign' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AuthWalletResponseDto,
    description: 'Wallet Auth Message created',
  })
  @Post('auth')
  async authMessage(
    @Req() req: RequestWithUser,
    @Body() authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    return this.walletService.authMessage(req.user.id, authWalletRequestDto)
  }

  @ApiOperation({ summary: 'Get wallets for user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetWalletsResponseDto,
    description: 'Wallets were retrieved',
  })
  @Get()
  async getWallets(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletsResponseDto> {
    return new GetWalletsResponseDto(
      await this.walletService.getWalletsForUser(req.user.id),
    )
  }

  @ApiOperation({ summary: 'Refresh tokens owned by a wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WalletResponseDto,
    description: 'Wallet tokens were updated',
  })
  @Post('/refresh/:walletId')
  async refreshWallets(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<WalletResponseDto> {
    return this.ethService.refreshNftsForWallet(req.user.id, walletId)
  }

  @ApiOperation({ summary: 'Creates unchecked wallet for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateWalletRequestDto,
    description: 'Unchecked wallet was created',
  })
  @Post('/unauthenticated')
  async createUnauthenticatedWallet(
    @Req() req: RequestWithUser,
    @Body()
    createUnauthenticatedWalletDto: CreateUnauthenticatedWalletRequestDto,
  ): Promise<void> {
    await this.walletService.createUnauthenticatedWallet(
      req.user.id,
      createUnauthenticatedWalletDto,
    )
  }
}
