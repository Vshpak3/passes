import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { get } from 'https'
import { RealIP } from 'nestjs-real-ip'
import MessageValidator from 'sns-validator'

import { RequestWithUser } from '../../types/request'
import { ApiEndpoint } from '../../web/endpoint.web'
import { RoleEnum } from '../auth/core/auth.role'
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
import { GetPayinsRequestDto, GetPayinsResponseDto } from './dto/get-payin.dto'
import {
  GetPayoutsRequestDto,
  GetPayoutsResponseDto,
} from './dto/get-payout.dto'
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
import {
  GetPayinMethodResponseDto,
  SetPayinMethodRequestDto,
} from './dto/payin-method.dto'
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
  private validator: MessageValidator

  constructor(private readonly paymentService: PaymentService) {
    this.validator = new MessageValidator()
  }

  /*
  -------------------------------------------------------------------------------
  CIRCLE
  -------------------------------------------------------------------------------
  */

  @ApiEndpoint({
    summary: 'Get circle encryption key',
    responseStatus: HttpStatus.OK,
    responseType: CircleEncryptionKeyResponseDto,
    responseDesc: 'Encryption key was retrieved',
    role: RoleEnum.NO_AUTH,
  })
  @Get('key')
  async getCircleEncryptionKey(): Promise<CircleEncryptionKeyResponseDto> {
    return await this.paymentService.getCircleEncryptionKey()
  }

  @ApiEndpoint({
    summary: 'Creates a card',
    responseStatus: HttpStatus.CREATED,
    responseType: CircleStatusResponseDto,
    responseDesc: 'A card was created',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Delete a card',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A card was deleted',
    role: RoleEnum.GENERAL,
  })
  @Delete('card/delete/:circleCardId')
  async deleteCircleCard(
    @Req() req: RequestWithUser,
    @Param('circleCardId') circleCardId: string,
  ): Promise<void> {
    await this.paymentService.deleteCircleCard(req.user.id, circleCardId)
  }

  @ApiEndpoint({
    summary: 'Get cards',
    responseStatus: HttpStatus.OK,
    responseType: GetCircleCardsResponseDto,
    responseDesc: 'Cards were retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('cards')
  async getCircleCards(
    @Req() req: RequestWithUser,
  ): Promise<GetCircleCardsResponseDto> {
    return new GetCircleCardsResponseDto(
      await this.paymentService.getCircleCards(req.user.id),
    )
  }

  @ApiEndpoint({
    summary: 'Get card by id',
    responseStatus: HttpStatus.OK,
    responseType: GetCircleCardResponseDto,
    responseDesc: 'Card was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('card/:cardId')
  async getCircleCard(
    @Req() req: RequestWithUser,
    @Param('cardId') cardId: string,
  ): Promise<GetCircleCardResponseDto> {
    return await this.paymentService.getCircleCard(req.user.id, cardId)
  }

  @ApiEndpoint({
    summary: 'Create a wire bank account',
    responseStatus: HttpStatus.CREATED,
    responseType: CircleStatusResponseDto,
    responseDesc: 'A wire bank account was created',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Delete a wire bank account',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A wire bank account was dleted',
    role: RoleEnum.GENERAL,
  })
  @Delete('bank/delete/:circleBankId')
  async deleteCircleBank(
    @Req() req: RequestWithUser,
    @Param('circleBankId') circleBankId: string,
  ): Promise<void> {
    await this.paymentService.deleteCircleBank(req.user.id, circleBankId)
  }

  @ApiEndpoint({
    summary: 'Get wire bank acccounts',
    responseStatus: HttpStatus.OK,
    responseType: GetCircleBanksResponseDto,
    responseDesc: 'Wire bank accounts were retrieved',
    role: RoleEnum.GENERAL,
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
  @ApiEndpoint({
    summary: 'Circle notifications',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Update from circle was received',
    role: RoleEnum.NO_AUTH,
  })
  @Post('circle/notification')
  async receiveNotifications(@Body() body: string) {
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

  @ApiEndpoint({
    summary: 'Circle notifications register',
    responseStatus: HttpStatus.OK,
    responseType: Boolean,
    responseDesc: 'Updates from circle was registered',
    role: RoleEnum.NO_AUTH,
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

  @ApiEndpoint({
    summary: 'Circlecard payin entrypoint',
    responseStatus: HttpStatus.CREATED,
    responseType: CircleCardPayinEntryResponseDto,
    responseDesc: 'Circecard payin was initiated',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Phantom USDC payin entrypoint',
    responseStatus: HttpStatus.CREATED,
    responseType: PhantomCircleUSDCEntryResponseDto,
    responseDesc: 'Phantom USDC payin was initiated',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Metamask USDC payin entrypoint',
    responseStatus: HttpStatus.CREATED,
    responseType: MetamaskCircleUSDCEntryResponseDto,
    responseDesc: 'Metamask USDC was initiated',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Metamask ETH payin entrypoint',
    responseStatus: HttpStatus.CREATED,
    responseType: MetamaskCircleETHEntryResponseDto,
    responseDesc: 'Metamask ETH was initiated',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Set default payin method',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A payin method was set as default',
    role: RoleEnum.GENERAL,
  })
  @Post('payin/default')
  async setDefaultPayinMethod(
    @Req() req: RequestWithUser,
    @Body() payinMethodDto: SetPayinMethodRequestDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayinMethod(
      req.user.id,
      payinMethodDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get default payin method',
    responseStatus: HttpStatus.OK,
    responseType: GetPayinMethodResponseDto,
    responseDesc: 'Default payin method was retrieved',
    role: RoleEnum.GENERAL,
  })
  @Get('payin/default')
  async getDefaultPayinMethod(
    @Req() req: RequestWithUser,
  ): Promise<GetPayinMethodResponseDto> {
    return await this.paymentService.getDefaultPayinMethod(req.user.id)
  }

  @ApiEndpoint({
    summary: 'Set default payout method',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'A payout method was set as default',
    role: RoleEnum.GENERAL,
  })
  @Post('payout/default')
  async setDefaultPayoutMethod(
    @Req() req: RequestWithUser,
    @Body() payoutMethodDto: SetPayoutMethodRequestDto,
  ): Promise<void> {
    return await this.paymentService.setDefaultPayoutMethod(
      req.user.id,
      payoutMethodDto,
    )
  }

  @ApiEndpoint({
    summary: 'Get default payout method',
    responseStatus: HttpStatus.OK,
    responseType: GetPayoutMethodResponseDto,
    responseDesc: 'Default payout method was retrieved',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Cancel a payin',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Payin was cancelled',
    role: RoleEnum.GENERAL,
  })
  @Post('payin/cancel/:payinId')
  async cancelPayin(
    @Req() req: RequestWithUser,
    @Param('payinId') payinId: string,
  ): Promise<void> {
    await this.paymentService.userCancelPayin(payinId, req.user.id)
  }

  @ApiEndpoint({
    summary: 'Uncreate a payin',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Payin was uncreated',
    role: RoleEnum.GENERAL,
  })
  @Post('payin/uncreate/:payinId')
  async uncreatePayin(
    @Req() req: RequestWithUser,
    @Param('payinId') payinId: string,
  ): Promise<void> {
    await this.paymentService.userUncreatePayin(payinId, req.user.id)
  }

  @ApiEndpoint({
    summary: 'Get all payins',
    responseStatus: HttpStatus.OK,
    responseType: GetPayinsResponseDto,
    responseDesc: 'Payins were retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('payins')
  async getPayins(
    @Req() req: RequestWithUser,
    @Body() getPayinsRequest: GetPayinsRequestDto,
  ): Promise<GetPayinsResponseDto> {
    return await this.paymentService.getPayins(req.user.id, getPayinsRequest)
  }
  /*
  -------------------------------------------------------------------------------
  Payout
  -------------------------------------------------------------------------------
  */

  @ApiEndpoint({
    summary: 'Get all payouts',
    responseStatus: HttpStatus.OK,
    responseType: GetPayoutsResponseDto,
    responseDesc: 'Payouts were retrieved',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Post('payouts')
  async getPayouts(
    @Req() req: RequestWithUser,
    @Body() getPayoutsRequest: GetPayoutsRequestDto,
  ): Promise<GetPayoutsResponseDto> {
    return await this.paymentService.getPayouts(req.user.id, getPayoutsRequest)
  }

  @ApiEndpoint({
    summary: 'Payout manually',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Payout was made',
    role: RoleEnum.CREATOR_ONLY,
  })
  @Get('payout')
  async payout(@Req() req: RequestWithUser): Promise<void> {
    await this.paymentService.payoutCreator(req.user.id)
  }

  /*
  -------------------------------------------------------------------------------
  Subscriptions
  -------------------------------------------------------------------------------
  */
  @ApiEndpoint({
    summary: 'Set subscription payin method',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Subscription payin method was set',
    role: RoleEnum.GENERAL,
  })
  @Post('subscription/method/:subscriptionId')
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

  @ApiEndpoint({
    summary: 'Cancel subscription',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Subscription was cancelled',
    role: RoleEnum.GENERAL,
  })
  @Delete('subscription/:subscriptionId')
  async cancelSubscription(
    @Req() req: RequestWithUser,
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    await this.paymentService.cancelSubscription(req.user.id, subscriptionId)
  }

  @ApiEndpoint({
    summary: 'Get subscriptions',
    responseStatus: HttpStatus.OK,
    responseType: GetSubscriptionsResponseDto,
    responseDesc: 'Subscriptions were retrieved',
    role: RoleEnum.GENERAL,
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

  @ApiEndpoint({
    summary: 'Register payin',
    responseStatus: HttpStatus.OK,
    responseType: RegisterPayinResponseDto,
    responseDesc: 'Payin registered',
    role: RoleEnum.GENERAL,
  })
  @Post('test/register/payin')
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

  @ApiEndpoint({
    summary: 'Get register payin data',
    responseStatus: HttpStatus.OK,
    responseType: PayinDataDto,
    responseDesc: 'Register payin data retrieved',
    role: RoleEnum.GENERAL,
  })
  @Post('test/register/payin/data')
  async registerPayinData(): Promise<PayinDataDto> {
    return { blocked: undefined, amount: 1000 }
  }

  @ApiEndpoint({
    summary: 'Rerun payout',
    responseStatus: HttpStatus.OK,
    responseType: undefined,
    responseDesc: 'Payout rerun',
    role: RoleEnum.NO_AUTH,
  })
  @Get('test/payout/:payoutId')
  async rePayout(@Param('payoutId') payoutId: string): Promise<void> {
    return await this.paymentService.submitPayout(payoutId)
  }
}
