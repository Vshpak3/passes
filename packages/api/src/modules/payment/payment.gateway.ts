import { ConfigService } from '@nestjs/config'
import { WebSocketGateway } from '@nestjs/websockets'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

import { GatewayBase } from '../../util/gateway.base'
import { PaymentNotificationDto } from './dto/payment-notification.dto'

@WebSocketGateway({
  namespace: '/api/payment/gateway',
  path: '/api/payment/gateway',
})
export class PaymentGateway extends GatewayBase {
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis('payment_subscriber') private readonly redisService: Redis,
  ) {
    super()
    this.secret = configService.get<string>('jwt.authSecret') as string
  }

  async onModuleInit() {
    if (
      this.redisService && // to fix tests
      this.redisService.subscribe &&
      this.redisService.on
    ) {
      await this.redisService.subscribe('payment')
      await this.redisService.on(
        'message',
        (_channel: string, dataStr: string) => {
          const payment: PaymentNotificationDto = JSON.parse(dataStr)
          this.send(payment.receiverId, 'payment', payment)
        },
      )
    }
  }
}
