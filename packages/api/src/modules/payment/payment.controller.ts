import {
  Body,
  Controller,
  Get,
  Head,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RealIP } from 'nestjs-real-ip'

import { RequestWithUser } from '../../types/request'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { CardEntityDto } from './dto/circle/card.entity.dto'
import { CircleNotificationDto } from './dto/circle/circle-notification.dto'
import { CreateBankDto } from './dto/circle/create-bank.dto'
import { CreateCardAndExtraDto } from './dto/circle/create-card.dto'
import { EncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { CircleStatusDto } from './dto/circle/status.dto'
import {
  CircleCardPayinEntryInputDto,
  CircleCardPayinEntryOutputDto,
} from './dto/payin-entry/circle-card.payin-entry.dto'
import {
  MetamaskCircleETHEntryInputDto,
  MetamaskCircleETHEntryOutputDto,
} from './dto/payin-entry/metamask-circle-eth.payin-entry.dto'
import {
  MetamaskCircleUSDCEntryInputDto,
  MetamaskCircleUSDCEntryOutputDto,
} from './dto/payin-entry/metamask-circle-usdc.payin-entry.dto'
import {
  PhantomCircleUSDCEntryInputDto,
  PhantomCircleUSDCEntryOutputDto,
} from './dto/payin-entry/phantom-circle-usdc.payin-entry.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /*
  -------------------------------------------------------------------------------
  CIRCLE
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Get circle encryption key' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EncryptionKeyDto,
    description: 'Encryption key was returned',
  })
  @Get('key')
  async getCircleEncryptionKey(): Promise<EncryptionKeyDto> {
    return this.paymentService.getCircleEncryptionKey()
  }

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusDto,
    description: 'A card was created',
  })
  @Post('card/create')
  @UseGuards(JwtAuthGuard)
  async createCircleCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CreateCardAndExtraDto,
  ): Promise<CircleStatusDto> {
    return this.paymentService.createCircleCard(
      ip,
      req.user.id,
      createCardAndExtraDto.createCardDto,
      createCardAndExtraDto.fourDigits,
    )
  }

  @ApiOperation({ summary: 'Check card status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleStatusDto,
    description: 'Status of card was returned',
  })
  @Get('card/status/:id')
  @UseGuards(JwtAuthGuard)
  async checkCircleCardStatus(
    @Param('id') id: string,
  ): Promise<CircleStatusDto> {
    return this.paymentService.checkCircleCardStatus(id)
  }

  @ApiOperation({ summary: 'Deletes a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'A card was deleted',
  })
  @Post('card/delete/:circleCardId')
  @UseGuards(JwtAuthGuard)
  async deleteCircleCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<boolean> {
    return await this.paymentService.deleteCircleCard(req.user.id, circleCardId)
  }

  @ApiOperation({ summary: 'Get cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CardEntityDto],
    description: 'Cards were returned',
  })
  @Get('cards')
  @UseGuards(JwtAuthGuard)
  async getCircleCards(
    @Req() req: RequestWithUser,
  ): Promise<Array<CardEntityDto>> {
    return (await this.paymentService.getCircleCards(req.user.id)).map(
      (entity) => new CardEntityDto(entity),
    )
  }

  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleStatusDto,
    description: 'Status of payment was returned',
  })
  @Get('status/:id')
  @UseGuards(JwtAuthGuard)
  async checkCirclePaymentStatus(
    @Param('id') id: string,
  ): Promise<CircleStatusDto> {
    return this.paymentService.checkCirclePaymentStatus(id)
  }

  @ApiOperation({ summary: 'Create wire bank account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusDto,
    description: 'A wire bank account was created',
  })
  @Post('bank/wire/create')
  @UseGuards(JwtAuthGuard)
  async createCircleWireBankAccount(
    @Req() req: RequestWithUser,
    @Body() createBankDto: CreateBankDto,
  ): Promise<CircleStatusDto> {
    return this.paymentService.createCircleWireBankAccount(
      req.user.id,
      createBankDto,
    )
  }

  @ApiOperation({ summary: 'Check wire bank status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleStatusDto,
    description: 'Status of bank was returned',
  })
  @Get('bank/wire/status/:id')
  @UseGuards(JwtAuthGuard)
  async checkWireBankStatus(@Param('id') id: string): Promise<CircleStatusDto> {
    return this.paymentService.checkCircleWireBankStatus(id)
  }

  // endpoint only called by circle to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  // TODO: handle payout notifications (and card/bank if available)
  @ApiOperation({ summary: 'Circle notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Update from circle was received',
  })
  @Post('circle/notification')
  async recieveNotifications(
    @Body()
    circleNotificationDto: CircleNotificationDto,
  ) {
    if (circleNotificationDto.clientId === undefined) {
      return true
    }
    return this.paymentService.processCircleUpdate(circleNotificationDto)
  }

  // endpoint only called by circle to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  // TODO: handle payout notifications (and card/bank if available)
  @ApiOperation({ summary: 'Circle notifications register' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Updates from circle was registered',
  })
  @Head('circle/notification')
  async registerNotifications(): Promise<boolean> {
    return true
  }

  /*
  -------------------------------------------------------------------------------
  GENERIC
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Set default payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A payin method was set as default',
  })
  @Post('payin/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultPayinMethod(
    @Req() req: RequestWithUser,
    @Body() payinMethodDto: PayinMethodDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayinMethod(
      req.user.id,
      payinMethodDto.method,
      payinMethodDto.methodId,
    )
  }

  @ApiOperation({ summary: 'Get default payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinMethodDto,
    description: 'Default payin method was returned',
  })
  @Get('payin/default')
  @UseGuards(JwtAuthGuard)
  async getDefaultPayin(@Req() req: RequestWithUser): Promise<PayinMethodDto> {
    return await this.paymentService.getDefaultPayinMethod(req.user.id)
  }

  @ApiOperation({ summary: 'Circlecard payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleCardPayinEntryOutputDto,
    description: 'Circecard payin was initiated',
  })
  @Post('payin/entry/circle-card')
  @UseGuards(JwtAuthGuard)
  async entryCircleCard(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: CircleCardPayinEntryInputDto,
  ): Promise<CircleCardPayinEntryOutputDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as CircleCardPayinEntryOutputDto
  }

  @ApiOperation({ summary: 'Phantom USDC payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PhantomCircleUSDCEntryOutputDto,
    description: 'Phantom USDC payin was initiated',
  })
  @Post('payin/entry/circle-card')
  @UseGuards(JwtAuthGuard)
  async entryPhantomCircleUSDC(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: PhantomCircleUSDCEntryInputDto,
  ): Promise<PhantomCircleUSDCEntryOutputDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as PhantomCircleUSDCEntryOutputDto
  }

  @ApiOperation({ summary: 'Metamask USDC payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MetamaskCircleUSDCEntryOutputDto,
    description: 'Metamask USDC was initiated',
  })
  @Post('payin/entry/metamask-usdc')
  @UseGuards(JwtAuthGuard)
  async entryMetamaskCircleUSDC(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: MetamaskCircleUSDCEntryInputDto,
  ): Promise<MetamaskCircleUSDCEntryOutputDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as MetamaskCircleUSDCEntryOutputDto
  }

  @ApiOperation({ summary: 'Metamask ETH payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MetamaskCircleETHEntryOutputDto,
    description: 'Metamask ETH was initiated',
  })
  @Post('payin/entry/metamask-eth')
  @UseGuards(JwtAuthGuard)
  async entryMetamaskCircleETH(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: MetamaskCircleETHEntryInputDto,
  ): Promise<MetamaskCircleETHEntryOutputDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as MetamaskCircleETHEntryOutputDto
  }
}
