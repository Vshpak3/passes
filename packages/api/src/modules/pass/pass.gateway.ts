import { ConfigService } from '@nestjs/config'
import { WebSocketGateway } from '@nestjs/websockets'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

import { GatewayBase } from '../../util/gateway.base'
import { PassHolderNotificationDto } from './dto/pass-notification.dto'

@WebSocketGateway({
  namespace: '/api/pass/gateway',
  path: '/api/pass/gateway',
})
export class PassGateway extends GatewayBase {
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis('pass_subscriber') private readonly redisService: Redis,
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
      await this.redisService.subscribe('pass')
      await this.redisService.on(
        'message',
        (_event: string, dataStr: string) => {
          const passHolder: PassHolderNotificationDto = JSON.parse(dataStr)
          this.send(passHolder.recieverId, 'pass', passHolder)
        },
      )
    }
  }
}
