import * as Joi from 'joi'

import {
  infra_config_aws_region,
  infra_config_node_env,
} from './config.options'
import { getConfigValue } from './config.value'

export const configValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DBNAME: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  OAUTH_GOOGLE_ID: Joi.string().required(),
  OAUTH_GOOGLE_SECRET: Joi.string().required(),
  OAUTH_GOOGLE_REDIRECT_URL: Joi.string().uri().required(),

  OAUTH_FACEBOOK_CLIENT_ID: Joi.string().required(),
  OAUTH_FACEBOOK_CLIENT_SECRET: Joi.string().required(),
  OAUTH_FACEBOOK_REDIRECT_URL: Joi.string().uri().required(),

  OAUTH_TWITTER_CONSUMER_KEY: Joi.string().required(),
  OAUTH_TWITTER_CONSUMER_SECRET: Joi.string().required(),
  OAUTH_TWITTER_REDIRECT_URL: Joi.string().uri().required(),

  COOKIE_SESSION_SECRET: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  CLIENT_URL: Joi.string().required(),

  CIRCLE_API_ENDPOINT: Joi.string().required(),
  CIRCLE_API_KEY: Joi.string().required(),
  CIRCLE_MASTER_WALLET_ID: Joi.number().required(),

  MORALIS_API_KEY: Joi.string().required(),
  MORALIS_API_HOST: Joi.string().required(),
})

export const configConfiguration = async function (): Promise<
  Record<string, Record<string, any>>
> {
  return await waitForValues({
    infra: {
      env: infra_config_node_env,
      region: infra_config_aws_region || 'none',
    },
    database: {
      host: getConfigValue('DATABASE_HOST'),
      port: getConfigValue('DATABASE_PORT', true),
      user: getConfigValue('DATABASE_USER'),
      password: getConfigValue('DATABASE_PASSWORD'),
      dbname: getConfigValue('DATABASE_DBNAME'),
    },
    redis: {
      host: getConfigValue('REDIS_HOST'),
      port: getConfigValue('REDIS_PORT', true),
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
      },
    },
    jwt: {
      secret: getConfigValue('JWT_SECRET'),
      expiresIn: getConfigValue('JWT_EXPIRES_IN'),
    },
    moralis: {
      api_key: getConfigValue('MORALIS_API_KEY'),
      api_host: getConfigValue('MORALIS_API_HOST'),
    },
    clientUrl: getConfigValue('CLIENT_URL'),
    circle: {
      api_endpoint: getConfigValue('CIRCLE_API_ENDPOINT'),
      api_key: getConfigValue('CIRCLE_API_KEY'),
      master_wallet_id: getConfigValue('CIRCLE_MASTER_WALLET_ID'),
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
