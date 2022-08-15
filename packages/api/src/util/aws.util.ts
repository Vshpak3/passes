import { ConfigService } from '@nestjs/config'

export function getAwsConfig(
  configService: ConfigService,
): Record<string, any> {
  if (configService.get('infra.env') === 'dev') {
    return {
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    }
  } else {
    return {
      region: configService.get('infra.region'),
    }
  }
}
