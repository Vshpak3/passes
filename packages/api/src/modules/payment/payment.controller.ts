import {
  Body,
  Controller,
  Delete,
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
import { AllowUnauthorizedRequest } from '../auth/auth.metadata'
import { ExamplePayinCallbackInput } from './callback.types'
import { CircleCreateBankRequestDto } from './dto/circle/create-bank.dto'
import { CircleCreateCardAndExtraRequestDto } from './dto/circle/create-card.dto'
import { CircleEncryptionKeyResponseDto } from './dto/circle/encryption-key.dto'
import { GetCircleBanksResponseDto } from './dto/circle/get-bank.dto'
import {
  GetCircleCardResponseDto,
  GetCircleCardsResponseDto,
} from './dto/circle/get-card.dto'
import { CircleStatusResponseDto } from './dto/circle/status.dto'
import { GetSubscriptionsResponseDto } from './dto/get-subscription.dto'
import { PayinDataDto } from './dto/payin-data.dto'
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
import {
  GetPayinMethodResponseDto,
  SetPayinMethodRequestDto,
} from './dto/payin-method.dto'
import {
  PayoutListRequestDto,
  PayoutListResponseDto,
} from './dto/payout-list.dto'
import {
  GetPayoutMethodResponseDto,
  SetPayoutMethodRequestDto,
} from './dto/payout-method.dto'
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
    type: CircleEncryptionKeyResponseDto,
    description: 'Encryption key was returned',
  })
  @Get('key')
  @HttpCode(200)
  @AllowUnauthorizedRequest()
  async getCircleEncryptionKey(): Promise<CircleEncryptionKeyResponseDto> {
    return await this.paymentService.getCircleEncryptionKey()
  }

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusResponseDto,
    description: 'A card was created',
  })
  @Post('card/create')
  async createCircleCard(
    @RealIP() ip: string,
    @Req() req: RequestWithUser,
    @Body() createCardAndExtraDto: CircleCreateCardAndExtraRequestDto,
  ): Promise<CircleStatusResponseDto> {
    return await this.paymentService.createCircleCard(
      ip,
      req.user.id,
      createCardAndExtraDto.createCardDto,
      createCardAndExtraDto.cardNumber,
    )
  }

  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A card was deleted',
  })
  @Delete('card/delete/:circleCardId')
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
    type: GetCircleCardsResponseDto,
    description: 'Cards were returned',
  })
  @Get('cards')
  async getCircleCards(
    @Req() req: RequestWithUser,
  ): Promise<GetCircleCardsResponseDto> {
    return new GetCircleCardsResponseDto(
      await this.paymentService.getCircleCards(req.user.id),
    )
  }

  @ApiOperation({ summary: 'Get card by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCircleCardResponseDto,
    description: 'Card was returned',
  })
  @Get('card/:cardId')
  async getCircleCard(
    @Req() req: RequestWithUser,
    @Param('cardId') cardId: string,
  ): Promise<GetCircleCardResponseDto> {
    return await this.paymentService.getCircleCard(req.user.id, cardId)
  }

  @ApiOperation({ summary: 'Create a wire bank account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CircleStatusResponseDto,
    description: 'A wire bank account was created',
  })
  @Post('bank/create')
  async createCircleBank(
    @Req() req: RequestWithUser,
    @Body() createBankDto: CircleCreateBankRequestDto,
  ): Promise<CircleStatusResponseDto> {
    return await this.paymentService.createCircleBank(
      req.user.id,
      createBankDto,
    )
  }

  @ApiOperation({ summary: 'Delete a wire bank account' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'A wire bank account was dleted',
  })
  @Delete('bank/delete/:circleBankId')
  async deleteCircleBank(
    @Req() req: RequestWithUser,
    @Param('circleBankId') circleBankId: string,
  ): Promise<void> {
    await this.paymentService.deleteCircleBank(req.user.id, circleBankId)
  }

  @ApiOperation({ summary: 'Get wire bank acccounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCircleBanksResponseDto,
    description: 'Wire bank accounts were returned',
  })
  @Get('banks')
  async getCircleBanks(
    @Req() req: RequestWithUser,
  ): Promise<GetCircleBanksResponseDto> {
    return new GetCircleBanksResponseDto(
      await this.paymentService.getCircleBanks(req.user.id),
    )
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
  @AllowUnauthorizedRequest()
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
  @AllowUnauthorizedRequest()
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
  Payment Methods Get/Set
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
    @Body() payinMethodDto: SetPayinMethodRequestDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayinMethod(
      req.user.id,
      payinMethodDto,
    )
  }

  @ApiOperation({ summary: 'Get default payin method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPayinMethodResponseDto,
    description: 'Default payin method was returned',
  })
  @Get('payin/default')
  async getDefaultPayinMethod(
    @Req() req: RequestWithUser,
  ): Promise<GetPayinMethodResponseDto> {
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
    @Body() payoutMethodDto: SetPayoutMethodRequestDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayoutMethod(
      req.user.id,
      payoutMethodDto,
    )
  }

  @ApiOperation({ summary: 'Get default payout method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPayoutMethodResponseDto,
    description: 'Default payout method was returned',
  })
  @Get('payout/default')
  async getDefaultPayoutMethod(
    @Req() req: RequestWithUser,
  ): Promise<GetPayoutMethodResponseDto> {
    return await this.paymentService.getDefaultPayoutMethod(req.user.id)
  }

  /*
  -------------------------------------------------------------------------------
  Payin
  -------------------------------------------------------------------------------
  */

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
  @Post('payins')
  @HttpCode(200)
  async getPayins(
    @Req() req: RequestWithUser,
    @Body() payinListRequest: PayinListRequestDto,
  ): Promise<PayinListResponseDto> {
    return await this.paymentService.getPayins(req.user.id, payinListRequest)
  }
  /*
  -------------------------------------------------------------------------------
  Payout
  -------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: 'Get all payouts' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayoutListResponseDto,
    description: 'Payouts were returned',
  })
  @Post('payouts')
  @HttpCode(200)
  async getPayouts(
    @Req() req: RequestWithUser,
    @Body() payoutListRequest: PayoutListRequestDto,
  ): Promise<PayoutListResponseDto> {
    return await this.paymentService.getPayouts(req.user.id, payoutListRequest)
  }

  @ApiOperation({ summary: 'Payout manually' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Payout was made',
  })
  @Post('payout')
  async payout(@Req() req: RequestWithUser): Promise<void> {
    await this.paymentService.payoutCreator(req.user.id)
  }

  /*
  -------------------------------------------------------------------------------
  Subscriptions
  -------------------------------------------------------------------------------
  */
  @ApiOperation({ summary: 'Set subscription payin method' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Subscription payin method was set',
  })
  @Post('subscription/method/:subscriptionId')
  @HttpCode(200)
  async setSubscriptionPayinMethod(
    @Req() req: RequestWithUser,
    @Param('subscriptionId') subscriptionId: string,
    @Body() payinMethodDto: SetPayinMethodRequestDto,
  ): Promise<void> {
    await this.paymentService.setSubscriptionPayinMethod(
      subscriptionId,
      req.user.id,
      payinMethodDto,
    )
  }

  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Subscription was cancelled',
  })
  @Delete('subscription/:subscriptionId')
  async cancelSubscription(
    @Req() req: RequestWithUser,
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    await this.paymentService.cancelSubscription(req.user.id, subscriptionId)
  }

  @ApiOperation({ summary: 'Get subscriptions' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSubscriptionsResponseDto,
    description: 'Subscriptions were returned',
  })
  @Get('subscriptions')
  async getSubscriptions(
    @Req() req: RequestWithUser,
  ): Promise<GetSubscriptionsResponseDto> {
    return new GetSubscriptionsResponseDto(
      await this.paymentService.getSubscriptions(req.user.id),
    )
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
      callbackInputJSON: { example: 'asdf' } as ExamplePayinCallbackInput,
      creatorId: req.user.id,
    })
  }

  @ApiOperation({ summary: 'Get register payin data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PayinDataDto,
    description: 'Register payin data returned',
  })
  @Post('test/register/payin/data')
  @HttpCode(200)
  async registerPayinData(): Promise<PayinDataDto> {
    return { blocked: false, amount: 1000 }
  }

  @ApiOperation({ summary: 'Payout everyone' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Everyone paid out',
  })
  @Get('test/payout')
  @AllowUnauthorizedRequest()
  async payoutAll(): Promise<void> {
    return await this.paymentService.payoutAll()
  }

  @ApiOperation({ summary: 'Rerun payout' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: undefined,
    description: 'Payout rerun',
  })
  @Get('test/payout/:payoutId')
  @AllowUnauthorizedRequest()
  async rePayout(@Param('payoutId') payoutId: string): Promise<void> {
    return await this.paymentService.submitPayout(payoutId)
  }
}
