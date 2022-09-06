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
import { ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
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
import { WalletService } from './wallet.service'

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly ethService: EthService,
  ) {}

  @ApiEndpoint({
    summary: 'Get user custodial wallet',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletResponseDto,
    responseDesc: 'User custodial wallet retrieved',
  })
  @Get('custodial')
  async getUserCustodialWallet(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getUserCustodialWallet(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Get default wallet',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletResponseDto,
    responseDesc: 'Default wallet retrieved',
  })
  @Get('default')
  async getDefaultWallet(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletResponseDto> {
    return await this.walletService.getDefaultWallet(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Set default wallet',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Default wallet set',
  })
  @Post('default/:walletId')
  async setDefaultWallet(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<void> {
    await this.walletService.setDefaultWallet(req.user.id, walletId)
  }

  @ApiEndpoint({
    summary: 'Creates authenticated wallet for a user',
    responseStatus: HttpStatus.CREATED,
    responseType: Boolean,
    responseDesc: 'Wallet was created',
  })
  @Post()
  async createWallet(
    @Req() req: RequestWithUser,
    @Body() createWalletDto: CreateWalletRequestDto,
  ): Promise<boolean> {
    return await this.walletService.createWallet(req.user.id, createWalletDto)
  }

  @ApiEndpoint({
    summary: 'Removes authenticated wallet for a user',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Wallet was deleted',
  })
  @Delete(':walletId')
  async removeWallet(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<boolean> {
    return this.walletService.removeWallet(req.user.id, walletId)
  }

  @ApiEndpoint({
    summary: 'Creates wallet auth message to sign',
    responseStatus: HttpStatus.CREATED,
    responseType: AuthWalletResponseDto,
    responseDesc: 'Wallet Auth Message created',
  })
  @Post('auth')
  async authMessage(
    @Req() req: RequestWithUser,
    @Body() authWalletRequestDto: AuthWalletRequestDto,
  ): Promise<AuthWalletResponseDto> {
    return this.walletService.authMessage(req.user.id, authWalletRequestDto)
  }

  @ApiEndpoint({
    summary: 'Get wallets for user',
    responseStatus: HttpStatus.OK,
    responseType: GetWalletsResponseDto,
    responseDesc: 'Wallets were retrieved',
  })
  @Get()
  async getWallets(
    @Req() req: RequestWithUser,
  ): Promise<GetWalletsResponseDto> {
    return new GetWalletsResponseDto(
      await this.walletService.getWalletsForUser(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Refresh tokens owned by a wallet',
    responseStatus: HttpStatus.OK,
    responseType: WalletResponseDto,
    responseDesc: 'Wallet tokens were updated',
  })
  @Post('refresh/:walletId')
  async refreshWallets(
    @Req() req: RequestWithUser,
    @Param('walletId') walletId: string,
  ): Promise<WalletResponseDto> {
    return this.ethService.refreshNftsForWallet(req.user.id, walletId)
  }

  @ApiEndpoint({
    summary: 'Creates unchecked wallet for a user',
    responseStatus: HttpStatus.CREATED,
    responseType: CreateWalletRequestDto,
    responseDesc: 'Unchecked wallet was created',
  })
  @Post('unauthenticated')
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
