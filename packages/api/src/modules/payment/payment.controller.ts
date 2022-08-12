import {
  Body,
  Controller,
  Get,
  Head,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { get } from 'https'
import { RealIP } from 'nestjs-real-ip'
import MessageValidator from 'sns-validator'

import { RequestWithUser } from '../../types/request'
import { PayinCallbackInput } from './callback.types'
import { CircleBankDto } from './dto/circle/circle-bank.dto'
import { CircleCardDto } from './dto/circle/circle-card.dto'
import { CircleCreateBankDto } from './dto/circle/create-bank.dto'
import { CircleCreateCardAndExtraDto } from './dto/circle/create-card.dto'
import { CircleEncryptionKeyDto } from './dto/circle/encryption-key.dto'
import { CircleStatusDto } from './dto/circle/status.dto'
import {
  CircleCardPayinEntryRequestDto,
  CircleCardPayinEntryResponseDto,
} from './dto/payin-entry/circle-card.payin-entry.dto'
import {
  MetamaskCircleETHEntryRequestDto,
  MetamaskCircleETHEntryResponseDto,
} from './dto/payin-entry/metamask-circle-eth.payin-entry.dto'
import {
  MetamaskCircleUSDCEntryRequestDto,
  MetamaskCircleUSDCEntryResponseDto,
} from './dto/payin-entry/metamask-circle-usdc.payin-entry.dto'
import {
  PhantomCircleUSDCEntryRequestDto,
  PhantomCircleUSDCEntryResponseDto,
} from './dto/payin-entry/phantom-circle-usdc.payin-entry.dto'
import { PayinListRequestDto, PayinListResponseDto } from './dto/payin-list.dto'
import { PayinMethodDto } from './dto/payin-method.dto'
import { PayoutMethodDto } from './dto/payout-method.dto'
import { RegisterPayinResponseDto } from './dto/register-payin.dto'
import { PayinCallbackEnum } from './enum/payin.callback.enum'
import { CircleRequestError } from './error/circle.error'
import { PaymentService } from './payment.service'

const circleArn =
  /^arn:aws:sns:.*:908968368384:(sandbox|prod)_platform-notifications-topic$/

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  validator: MessageValidator
  constructor(private readonly paymentService: PaymentService) {
    this.validator = new MessageValidator()
  }

  /*
  -------------------------------------------------------------------------------
  CIRCLE
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Get circle encryption key' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleEncryptionKeyDto,
    description: 'Encryption key was returned',
  })
  @Get('key')
  @HttpCode(200)
  async getCircleEncryptionKey(): Promise<CircleEncryptionKeyDto> {
    return await this.paymentService.getCircleEncryptionKey()
  }

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusDto,
    description: 'A card was created',
  })
  @Post('card/create')
  async createCircleCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CircleCreateCardAndExtraDto,
  ): Promise<CircleStatusDto> {
    return await this.paymentService.createCircleCard(
      ip,
      req.user.id,
      createCardAndExtraDto.createCardDto,
      createCardAndExtraDto.fourDigits,
    )
  }

  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A card was deleted',
  })
  @Post('card/delete/:circleCardId')
  @HttpCode(200)
  async deleteCircleCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<void> {
    await this.paymentService.deleteCircleCard(req.user.id, circleCardId)
  }

  @ApiOperation({ summary: 'Get cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CircleCardDto],
    description: 'Cards were returned',
  })
  @Get('cards')
  async getCircleCards(
    @Req() req: RequestWithUser,
  ): Promise<Array<CircleCardDto>> {
    return await this.paymentService.getCircleCards(req.user.id)
  }

  @ApiOperation({ summary: 'Create a wire bank account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusDto,
    description: 'A wire bank account was created',
  })
  @Post('bank/create')
  async createCircleBank(
    @Req() req: RequestWithUser,
    @Body() createBankDto: CircleCreateBankDto,
  ): Promise<CircleStatusDto> {
    return await this.paymentService.createCircleBank(
      req.user.id,
      createBankDto,
    )
  }

  @ApiOperation({ summary: 'Delete a wire bank account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CircleStatusDto,
    description: 'A wire bank account was dleted',
  })
  @Post('bank/delete/:circleBankId')
  async deleteCircleBank(
    @Req() req: RequestWithUser,
    @Param('circleBankId') circleBankId: string,
  ): Promise<void> {
    await this.paymentService.deleteCircleBank(req.user.id, circleBankId)
  }

  @ApiOperation({ summary: 'Get wire bank acccounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CircleBankDto],
    description: 'Wire bank accounts were returned',
  })
  @Get('banks')
  async getCircleBanks(
    @Req() req: RequestWithUser,
  ): Promise<Array<CircleBankDto>> {
    return await this.paymentService.getCircleBanks(req.user.id)
  }

  // endpoint only called by circle to give us notifications
  // (must register endpoint through circle API if it changes)
  // TODO: authenticate circle url
  @ApiOperation({ summary: 'Circle notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Update from circle was received',
  })
  @Post('circle/notification')
  @HttpCode(200)
  async recieveNotifications(@Body() body: string) {
    const envelope = JSON.parse(body)
    this.validator.validate(envelope, (err) => {
      if (err) {
        throw new CircleRequestError('bad notification request')
      }
    })
    switch (envelope.Type) {
      case 'SubscriptionConfirmation': {
        if (!circleArn.test(envelope.TopicArn)) {
          throw new CircleRequestError(
            `Unable to confirm the subscription as the topic arn is not expected ${envelope.TopicArn}. Valid topic arn must match ${circleArn}.`,
          )
        }
        get(envelope.SubscribeURL)
        break
      }
      case 'Notification': {
        await this.paymentService.processCircleUpdate(
          JSON.parse(envelope.Message),
        )
      }
    }
  }

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
  PAYIN ENTRYPOINTS (one for each PayinMethodEnum)
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Circlecard payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleCardPayinEntryResponseDto,
    description: 'Circecard payin was initiated',
  })
  @Post('payin/entry/circle-card')
  async entryCircleCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: CircleCardPayinEntryRequestDto,
  ): Promise<CircleCardPayinEntryResponseDto> {
    payinEntryInputDto.ip = ip
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as CircleCardPayinEntryResponseDto
  }

  @ApiOperation({ summary: 'Phantom USDC payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PhantomCircleUSDCEntryResponseDto,
    description: 'Phantom USDC payin was initiated',
  })
  @Post('payin/entry/phantom-usdc')
  async entryPhantomCircleUSDC(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: PhantomCircleUSDCEntryRequestDto,
  ): Promise<PhantomCircleUSDCEntryResponseDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as PhantomCircleUSDCEntryResponseDto
  }

  @ApiOperation({ summary: 'Metamask USDC payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MetamaskCircleUSDCEntryResponseDto,
    description: 'Metamask USDC was initiated',
  })
  @Post('payin/entry/metamask-usdc')
  async entryMetamaskCircleUSDC(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: MetamaskCircleUSDCEntryRequestDto,
  ): Promise<MetamaskCircleUSDCEntryResponseDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as MetamaskCircleUSDCEntryResponseDto
  }

  @ApiOperation({ summary: 'Metamask ETH payin entrypoint' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MetamaskCircleETHEntryResponseDto,
    description: 'Metamask ETH was initiated',
  })
  @Post('payin/entry/metamask-eth')
  async entryMetamaskCircleETH(
    @Req() req: RequestWithUser,
    @Body() payinEntryInputDto: MetamaskCircleETHEntryRequestDto,
  ): Promise<MetamaskCircleETHEntryResponseDto> {
    return (await this.paymentService.payinEntryHandler(
      req.user.id,
      payinEntryInputDto,
    )) as MetamaskCircleETHEntryResponseDto
  }

  /*
  -------------------------------------------------------------------------------
  GENERAL
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Set default payin method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A payin method was set as default',
  })
  @Post('payin/default')
  @HttpCode(200)
  async setDefaultPayinMethod(
    @Req() req: RequestWithUser,
    @Body() payinMethodDto: PayinMethodDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayinMethod(
      req.user.id,
      payinMethodDto,
    )
  }

  @ApiOperation({ summary: 'Get default payin method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinMethodDto,
    description: 'Default payin method was returned',
  })
  @Get('payin/default')
  async getDefaultPayinMethod(
    @Req() req: RequestWithUser,
  ): Promise<PayinMethodDto> {
    return await this.paymentService.getDefaultPayinMethod(req.user.id)
  }

  @ApiOperation({ summary: 'Set default payout method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A payout method was set as default',
  })
  @Post('payout/default')
  @HttpCode(200)
  async setDefaultPayoutMethod(
    @Req() req: RequestWithUser,
    @Body() payoutMethodDto: PayoutMethodDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayoutMethod(
      req.user.id,
      payoutMethodDto,
    )
  }

  @ApiOperation({ summary: 'Get default payout method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayoutMethodDto,
    description: 'Default payout method was returned',
  })
  @Get('payout/default')
  async getDefaultPayoutMethod(
    @Req() req: RequestWithUser,
  ): Promise<PayoutMethodDto> {
    return await this.paymentService.getDefaultPayoutMethod(req.user.id)
  }

  @ApiOperation({ summary: 'Cancel a payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Payin was cancelled',
  })
  @Post('payin/cancel/:payinId')
  @HttpCode(200)
  async cancelPayin(
    @Req() req: RequestWithUser,
    @Param('payinId') payinId: string,
  ): Promise<void> {
    await this.paymentService.userCancelPayin(payinId, req.user.id)
  }

  @ApiOperation({ summary: 'Get all payins' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinListResponseDto,
    description: 'Payins were returned',
  })
  @Post('payin')
  @HttpCode(200)
  async getPayins(
    @Req() req: RequestWithUser,
    @Body() payinListRequest: PayinListRequestDto,
  ): Promise<PayinListResponseDto> {
    return await this.paymentService.getPayins(req.user.id, payinListRequest)
  }

  /*
  -------------------------------------------------------------------------------
  TEST (to be removed)
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Register payin' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterPayinResponseDto,
    description: 'Payin registered',
  })
  @Post('test/register/payin')
  @HttpCode(200)
  async registerPayin(
    @Req() req: RequestWithUser,
  ): Promise<RegisterPayinResponseDto> {
    return await this.paymentService.registerPayin({
      userId: req.user.id,
      amount: 1000,
      callback: PayinCallbackEnum.EXAMPLE,
      callbackInputJSON: { example: 'asdf' } as PayinCallbackInput,
      creatorShares: [{ creatorId: req.user.id, amount: 500 }],
    })
  }

  @ApiOperation({ summary: 'Payout everyone' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Everyone paid out',
  })
  @Get('test/payout')
  async payout(): Promise<void> {
    return await this.paymentService.payoutAll()
  }

  @ApiOperation({ summary: 'Rerun payout' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Payout rerun',
  })
  @Get('test/payout/:payoutId')
  async rePayout(@Param('payoutId') payoutId: string): Promise<void> {
    return await this.paymentService.submitPayout(payoutId)
  }
}
