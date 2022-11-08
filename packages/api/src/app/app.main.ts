/* eslint no-console: 0 */

import { INestApplicationContext, ValidationPipe } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import passport from 'passport'

import { AppModule } from '../app.module'
import { createLogger } from '../monitoring/logging/logging.custom'
import { isEnv } from '../util/env'

const APPLICATION_PORT = 3001

export class App {
  public app: NestExpressApplication
  public document: OpenAPIObject

  static async initStandalone(): Promise<INestApplicationContext> {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: await createLogger(),
    })
    app.enableShutdownHooks()
    return app
  }

  async init() {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    await this.initApp()
    if (isEnv('dev')) {
      await this.initSwagger()
    }
    console.log('Successfully initialized application')
  }

  private async initApp() {
    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: await createLogger(),
    })

    // Prefix all routes with /api
    this.app.setGlobalPrefix('api', { exclude: [''] })

    // Enable class-validator and class-transformer globally
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { excludeExtraneousValues: true },
      }),
    )

    // Setup CORS
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
    this.app.disable('x-powered-by')
    this.app.use(cookieParser())

    // Adds protection against well-known web vulnerabilities by setting HTTP headers appropriately
    this.app.use(helmet())

    // For Twitter OAuth 1.0
    const secret = process.env.OAUTH_TWITTER_COOKIE_SECRET as string
    this.app.use(session({ secret }))
    this.app.use(passport.session())

    // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
    this.app.enableShutdownHooks()
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
