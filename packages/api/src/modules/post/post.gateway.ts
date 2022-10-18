import { ConfigService } from '@nestjs/config'
import { WebSocketGateway } from '@nestjs/websockets'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

import { GatewayBase } from '../../util/gateway.base'
import { PostNotificationDto } from './dto/post-notification.dto'

@WebSocketGateway({
  namespace: '/api/post/gateway',
  path: '/api/post/gateway',
})
export class PostGateway extends GatewayBase {
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis('subscriber') private readonly redisService: Redis,
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
      await this.redisService.subscribe('post')
      await this.redisService.on('post', (_event: string, dataStr: string) => {
        const post: PostNotificationDto = JSON.parse(dataStr)
        this.send(post.recieverId, 'post', post)
      })
    }
  }
}
