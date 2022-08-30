import { ConfigService } from '@nestjs/config'

import { MetricsModuleOptions } from './metric.module'

export const metricOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<MetricsModuleOptions> => ({
    globalTags: { env: configService.get('infra.env') as string },
    mock: configService.get('infra.env') === 'dev',
    // Send metrics to the local daemon. This host must match the docker gateway
    // ip in order properly hit localhost outside of the docker container
    host: '172.17.0.1',
    port: 8125,
  }),
  inject: [ConfigService],
}
