import { ConfigService } from '@nestjs/config'
import { WebSocketGateway } from '@nestjs/websockets'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

import { GatewayBase } from '../../util/gateway.base'
import { MessageNotificationDto } from './dto/message-notification.dto'

@WebSocketGateway({
  namespace: '/api/messages/gateway',
  path: '/api/messages/gateway',
})
export class MessagesGateway extends GatewayBase {
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis('subscriber') private readonly redisService: Redis,
  ) {
    super()
    this.secret = configService.get<string>('jwt.authSecret') as string
  }

  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    await this.redisService.subscribe('message')
    await this.redisService.on('message', (_event: string, dataStr: string) => {
      const message: MessageNotificationDto = JSON.parse(dataStr)
      if (!message.pending) {
        self.send(message.recieverId, 'message', message)
      }
      self.send(message.senderId, 'message', message)
    })
  }
}
