import { ConfigService } from '@nestjs/config'
import { WebSocketGateway } from '@nestjs/websockets'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

import { GatewayBase } from '../../util/gateway.base'

@WebSocketGateway({
  namespace: '/api/notifications/gateway',
  path: '/api/notifications/gateway',
})
export class NotificationsGateway extends GatewayBase {
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis('subscriber') private readonly redisService: Redis,
  ) {
    super()
    this.secret = configService.get<string>('jwt.authSecret') as string
  }
}
