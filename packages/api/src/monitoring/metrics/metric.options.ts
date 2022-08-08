import { ConfigService } from '@nestjs/config'

import { MetricsModuleOptions } from './metric.module'

export const metricOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<MetricsModuleOptions> => ({
    // Use default host and port (sends to local daemon)
    globalTags: { env: configService.get('infra.env') as string },
    mock: configService.get('infra.env') === 'dev',
  }),
  inject: [ConfigService],
}
