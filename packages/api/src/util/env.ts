import { ConfigService } from '@nestjs/config'

type Env = 'dev' | 'stage' | 'prod'

export function isEnv(configService: ConfigService, env: Env): boolean {
  return configService.get('infra.env') === env
}
