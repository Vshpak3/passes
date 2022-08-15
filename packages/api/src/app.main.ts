import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { WinstonModule } from 'nest-winston'
import passport from 'passport'

import { AppModule } from './app.module'
import { loggingOptions } from './monitoring/logging/logging.options'

const APPLICATION_PORT = 3001

export class App {
  app: INestApplication
  document: OpenAPIObject

  async init() {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    await this.initApp()
    if (process.env.NODE_ENV === 'dev') {
      await this.initSwagger()
    }
    console.log('Successfully initialized application')
  }

  private async initApp() {
    this.app = await NestFactory.create(AppModule, {
      // Use a custom logger here to format the bootstrap/startup logs
      logger: WinstonModule.createLogger(await loggingOptions.useFactory()),
    })
    this.app.setGlobalPrefix('api', { exclude: [''] })
    this.app.useGlobalPipes(new ValidationPipe())
    this.app.enableCors()
    this.app.use(cookieParser())

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
      .build()
    this.document = SwaggerModule.createDocument(this.app, swaggerConfig)
    SwaggerModule.setup('api', this.app, this.document)
  }

  async listen() {
    await this.app.listen(APPLICATION_PORT)
  }
}
