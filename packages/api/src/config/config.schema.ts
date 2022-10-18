import * as Joi from 'joi'
import ms from 'ms'

import {
  infra_config_aws_region,
  infra_config_node_env,
} from './config.options'
import { getConfigValue } from './config.value'

export const configValidationSchema = Joi.object({
  // -----------------------------------------------------------

  CLIENT_URL: Joi.string().required(),
  API_URL: Joi.string().required(),

  // -----------------------------------------------------------

  DATABASE_HOST_RO: Joi.string().required(),
  DATABASE_HOST_RW: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DBNAME: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  MONITORING_SENTRY_DSN: Joi.string().required(),

  // -----------------------------------------------------------

  S3_BUCKET_NFT: Joi.string().required(),
  S3_BUCKET_PUBLIC: Joi.string().required(),
  S3_BUCKET_USERCONTENT: Joi.string().required(),
  S3_BUCKET_W9: Joi.string().required(),

  SES_SENDER_EMAIL: Joi.string().required(),

  // -----------------------------------------------------------

  OAUTH_GOOGLE_ID: Joi.string().required(),
  OAUTH_GOOGLE_SECRET: Joi.string().required(),

  OAUTH_FACEBOOK_CLIENT_ID: Joi.string().required(),
  OAUTH_FACEBOOK_CLIENT_SECRET: Joi.string().required(),

  OAUTH_TWITTER_CONSUMER_KEY: Joi.string().required(),
  OAUTH_TWITTER_CONSUMER_SECRET: Joi.string().required(),

  JWT_AUTH_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  OAUTH_TWITTER_COOKIE_SECRET: Joi.string().required(),

  ADMIN_SECRET: Joi.string().required(),

  // -----------------------------------------------------------

  CLOUDFRONT_COOKIE_DOMAIN: Joi.string().required(),
  CLOUDFRONT_BASE_URL: Joi.string().uri().required(),
  CLOUDFRONT_KEY_PAIR_ID: Joi.string().required(),
  CLOUDFRONT_PRIVATE_KEY: Joi.string().required(),

  // -----------------------------------------------------------

  CIRCLE_API_ENDPOINT: Joi.string().required(),
  CIRCLE_API_KEY: Joi.string().required(),
  CIRCLE_MASTER_WALLET_ID: Joi.string().required(),

  ALCHEMY_SOL_API_KEY: Joi.string().required(),
  ALCHEMY_SOL_HTTPS_ENDPOINT: Joi.string().uri().required(),
  ALCHEMY_ETH_API_KEY: Joi.string().required(),
  ALCHEMY_ETH_HTTPS_ENDPOINT: Joi.string().uri().required(),

  PERSONA_API_KEY: Joi.string().required(),

  COINMARKETCAP_API_KEY: Joi.string().required(),

  // -----------------------------------------------------------

  BLOCKCHAIN_NETWORKS: Joi.string().required(),

  // -----------------------------------------------------------
})

export const configConfiguration = async function (): Promise<
  Record<string, Record<string, any>>
> {
  return await waitForValues({
    infra: {
      env: infra_config_node_env,
      region: infra_config_aws_region || 'none',
    },
    clientUrl: getConfigValue('CLIENT_URL'),
    apiBaseUrl: getConfigValue('API_URL'),
    database: {
      hostReadWrite: getConfigValue('DATABASE_HOST_RW'),
      hostReadOnly: getConfigValue('DATABASE_HOST_RO'),
      port: getConfigValue('DATABASE_PORT', parseInt),
      user: getConfigValue('DATABASE_USER'),
      password: getConfigValue('DATABASE_PASSWORD'),
      dbname: getConfigValue('DATABASE_DBNAME'),
    },
    redis: {
      host: getConfigValue('REDIS_HOST'),
      port: getConfigValue('REDIS_PORT', parseInt),
    },
    monitoring: {
      sentryDsn: getConfigValue('MONITORING_SENTRY_DSN'),
      sentryEnabled:
        (await getConfigValue('MONITORING_SENTRY_DSN')) != 'disable',
    },
    s3_bucket: {
      nft: getConfigValue('S3_BUCKET_NFT'),
      public: getConfigValue('S3_BUCKET_PUBLIC'),
      usercontent: getConfigValue('S3_BUCKET_USERCONTENT'),
      w9: getConfigValue('S3_BUCKET_W9'),
    },
    ses: {
      senderEmail: getConfigValue('SES_SENDER_EMAIL'),
    },
    oauth: {
      google: {
        id: getConfigValue('OAUTH_GOOGLE_ID'),
        secret: getConfigValue('OAUTH_GOOGLE_SECRET'),
      },
      facebook: {
        id: getConfigValue('OAUTH_FACEBOOK_CLIENT_ID'),
        secret: getConfigValue('OAUTH_FACEBOOK_CLIENT_SECRET'),
      },
      twitter: {
        consumerKey: getConfigValue('OAUTH_TWITTER_CONSUMER_KEY'),
        consumerSecret: getConfigValue('OAUTH_TWITTER_CONSUMER_SECRET'),
        cookieSecret: getConfigValue('OAUTH_TWITTER_COOKIE_SECRET'),
      },
    },
    jwt: {
      authSecret: getConfigValue('JWT_AUTH_SECRET'),
      authExpiresIn: '12 hours',
      refreshSecret: getConfigValue('JWT_REFRESH_SECRET'),
      refreshExpiresIn: '7 days',
    },
    admin: {
      secret: getConfigValue('ADMIN_SECRET'),
    },
    cloudfront: {
      baseUrl: getConfigValue('CLOUDFRONT_BASE_URL'),
      keyPairId: getConfigValue('CLOUDFRONT_KEY_PAIR_ID'),
      privateKey: getConfigValue('CLOUDFRONT_PRIVATE_KEY'),
      signedUrlExpirationTime: ms('5 minutes'),
      signedCookieExpirationTime: ms('1 day'),
      cookieOptions: {
        domain: getConfigValue('CLOUDFRONT_COOKIE_DOMAIN'),
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    },
    circle: {
      api_endpoint: getConfigValue('CIRCLE_API_ENDPOINT'),
      api_key: getConfigValue('CIRCLE_API_KEY'),
      master_wallet_id: getConfigValue('CIRCLE_MASTER_WALLET_ID'),
    },
    alchemy: {
      sol: {
        api_key: getConfigValue('ALCHEMY_SOL_API_KEY'),
        https_endpoint: getConfigValue('ALCHEMY_SOL_HTTPS_ENDPOINT'),
      },
      eth: {
        api_key: getConfigValue('ALCHEMY_ETH_API_KEY'),
        https_endpoint: getConfigValue('ALCHEMY_ETH_HTTPS_ENDPOINT'),
      },
    },
    persona: {
      api_key: getConfigValue('PERSONA_API_KEY'),
    },
    coinmarketcap: {
      api_key: getConfigValue('COINMARKETCAP_API_KEY'),
    },
    blockchain: {
      networks: getConfigValue('BLOCKCHAIN_NETWORKS'),
    },
  })
}

async function waitForValues(dictionary) {
  for (const key in dictionary) {
    const value = dictionary[key]
    if (value.constructor == Object) {
      dictionary[key] = await waitForValues(value)
    } else {
      dictionary[key] = await value
    }
  }
  return dictionary
}
