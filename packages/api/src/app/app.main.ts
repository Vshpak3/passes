/* eslint no-console: 0 */

import {
  INestApplication,
  INestApplicationContext,
  ValidationPipe,
} from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestFactory } from '@nestjs/core'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import { WinstonModule } from 'nest-winston'
import passport from 'passport'

import { AppModule } from '../app.module'
import { loggingOptions } from '../monitoring/logging/logging.options'
import { isEnv } from '../util/env'

const APPLICATION_PORT = 3001

export class App {
  public app: INestApplication
  public document: OpenAPIObject

  async init() {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    await this.initApp()
    if (isEnv('dev')) {
      await this.initSwagger()
    }
    console.log('Successfully initialized application')
  }

  static async initStandalone(): Promise<INestApplicationContext> {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    return await NestFactory.createApplicationContext(AppModule, {
      // Use a custom logger here to format the bootstrap/startup logs
      logger: WinstonModule.createLogger(await loggingOptions.useFactory()),
    })
  }

  private async initApp() {
    this.app = await NestFactory.create(AppModule, {
      // Use a custom logger here to format the bootstrap/startup logs
      logger: WinstonModule.createLogger(await loggingOptions.useFactory()),
    })
    this.app.setGlobalPrefix('api', { exclude: [''] })
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { excludeExtraneousValues: true },
      }),
    )

    const corsConfig: CorsOptions = {
      origin: [
        process.env.CLIENT_URL ?? '',
        process.env.CLOUDFRONT_COOKIE_DOMAIN ?? '',
        `.${process.env.CLOUDFRONT_COOKIE_DOMAIN}` ?? '',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    }

    this.app.enableCors(corsConfig)
    this.app.use(cookieParser())

    // Adds protection against well-known web vulnerabilities by setting HTTP headers appropriately.
    this.app.use(helmet())

    // For Twitter OAuth 1.0
    this.app.use(
      session({ secret: process.env.OAUTH_TWITTER_COOKIE_SECRET as string }),
    )
    this.app.use(passport.session())
  }

  private async initSwagger() {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Passes Backend')
      .setDescription('Get your pass')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    this.document = SwaggerModule.createDocument(this.app, swaggerConfig, {
      operationIdFactory: (_controllerKey: string, methodKey: string) =>
        methodKey,
    })
    SwaggerModule.setup('api', this.app, this.document)
  }

  async listen() {
    this.app.useWebSocketAdapter(new IoAdapter(this.app))
    await this.app.listen(APPLICATION_PORT)
  }
}
