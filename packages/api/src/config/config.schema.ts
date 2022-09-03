import * as Joi from 'joi'

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

  DATABASE_HOSTS: Joi.string().required(),
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

  SES_SENDER_EMAIL: Joi.string().required(),

  // -----------------------------------------------------------

  OAUTH_GOOGLE_ID: Joi.string().required(),
  OAUTH_GOOGLE_SECRET: Joi.string().required(),
  OAUTH_GOOGLE_REDIRECT_URL: Joi.string().uri().required(),

  OAUTH_FACEBOOK_CLIENT_ID: Joi.string().required(),
  OAUTH_FACEBOOK_CLIENT_SECRET: Joi.string().required(),
  OAUTH_FACEBOOK_REDIRECT_URL: Joi.string().uri().required(),

  OAUTH_TWITTER_CONSUMER_KEY: Joi.string().required(),
  OAUTH_TWITTER_CONSUMER_SECRET: Joi.string().required(),
  OAUTH_TWITTER_REDIRECT_URL: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  OAUTH_TWITTER_COOKIE_SECRET: Joi.string().required(),

  ADMIN_IMPERSONATE_SECRET: Joi.string().required(),

  // -----------------------------------------------------------

  CLOUDFRONT_COOKIE_DOMAIN: Joi.string().required(),
  CLOUDFRONT_BASE_URL: Joi.string().uri().required(),
  CLOUDFRONT_KEY_PAIR_ID: Joi.string().required(),
  CLOUDFRONT_PRIVATE_KEY: Joi.string().required(),

  // -----------------------------------------------------------

  CIRCLE_API_ENDPOINT: Joi.string().required(),
  CIRCLE_API_KEY: Joi.string().required(),
  CIRCLE_MASTER_WALLET_ID: Joi.string().required(),

  MORALIS_API_KEY: Joi.string().required(),
  MORALIS_API_HOST: Joi.string().required(),

  STREAM_API_KEY: Joi.string().required(),
  STREAM_API_SECRET: Joi.string().required(),

  ALCHEMY_SOL_API_KEY: Joi.string().required(),
  ALCHEMY_SOL_HTTPS_ENDPOINT: Joi.string().uri().required(),
  ALCHEMY_ETH_API_KEY: Joi.string().required(),
  ALCHEMY_ETH_HTTPS_ENDPOINT: Joi.string().uri().required(),

  PERSONA_API_KEY: Joi.string().required(),

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
      hosts: getConfigValue('DATABASE_HOSTS', JSON.parse),
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
      sentry_dsn: getConfigValue('MONITORING_SENTRY_DSN'),
      sentry_enabled:
        (await getConfigValue('MONITORING_SENTRY_DSN')) != 'disable',
    },
    s3_bucket: {
      nft: getConfigValue('S3_BUCKET_NFT'),
      public: getConfigValue('S3_BUCKET_PUBLIC'),
      usercontent: getConfigValue('S3_BUCKET_USERCONTENT'),
    },
    ses: {
      senderEmail: getConfigValue('SES_SENDER_EMAIL'),
    },
    oauth: {
      google: {
        id: getConfigValue('OAUTH_GOOGLE_ID'),
        secret: getConfigValue('OAUTH_GOOGLE_SECRET'),
        redirect_url: getConfigValue('OAUTH_GOOGLE_REDIRECT_URL'),
      },
      facebook: {
        id: getConfigValue('OAUTH_FACEBOOK_CLIENT_ID'),
        secret: getConfigValue('OAUTH_FACEBOOK_CLIENT_SECRET'),
        redirect_url: getConfigValue('OAUTH_FACEBOOK_REDIRECT_URL'),
      },
      twitter: {
        consumerKey: getConfigValue('OAUTH_TWITTER_CONSUMER_KEY'),
        consumerSecret: getConfigValue('OAUTH_TWITTER_CONSUMER_SECRET'),
        redirect_url: getConfigValue('OAUTH_TWITTER_REDIRECT_URL'),
        cookieSecret: getConfigValue('OAUTH_TWITTER_COOKIE_SECRET'),
      },
    },
    jwt: {
      secret: getConfigValue('JWT_SECRET'),
      expiresIn: getConfigValue('JWT_EXPIRES_IN'),
      refreshSecret: getConfigValue('JWT_REFRESH_SECRET'),
      refreshExpiresIn: getConfigValue('JWT_REFRESH_EXPIRES_IN'),
    },
    admin: {
      impersonate: getConfigValue('ADMIN_IMPERSONATE_SECRET'),
    },
    cloudfront: {
      baseUrl: getConfigValue('CLOUDFRONT_BASE_URL'),
      keyPairId: getConfigValue('CLOUDFRONT_KEY_PAIR_ID'),
      privateKey: getConfigValue('CLOUDFRONT_PRIVATE_KEY'),
      signedUrlExpirationTime: 1000 * 60 * 5, // 5 minutes expiration time in ms
      signedCookieExpirationTime: 1000 * 60 * 60 * 24, // 1 day expiration time in ms
      cookieOptions: {
        domain: getConfigValue('CLOUDFRONT_COOKIE_DOMAIN'),
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    },
    moralis: {
      api_key: getConfigValue('MORALIS_API_KEY'),
      api_host: getConfigValue('MORALIS_API_HOST'),
    },
    circle: {
      api_endpoint: getConfigValue('CIRCLE_API_ENDPOINT'),
      api_key: getConfigValue('CIRCLE_API_KEY'),
      master_wallet_id: getConfigValue('CIRCLE_MASTER_WALLET_ID'),
    },
    stream: {
      api_key: getConfigValue('STREAM_API_KEY'),
      api_secret: getConfigValue('STREAM_API_SECRET'),
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
