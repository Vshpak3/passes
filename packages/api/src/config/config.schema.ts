import * as Joi from 'joi'

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

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
})

export const configConfiguration = async function (): Promise<
  Record<string, Record<string, any>>
> {
  return await waitForValues({
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
    },
    jwt: {
      secret: getConfigValue('JWT_SECRET'),
      expiresIn: getConfigValue('JWT_EXPIRES_IN'),
    },
  })
}

async function waitForValues(dictionary) {
  for (const key in dictionary) {
    const value = dictionary[key]
    if (value.constructor == Object) {
      waitForValues(value)
    } else {
      dictionary[key] = await value
    }
  }
  return dictionary
}
