import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'

import { AppModule } from './app.module'

const APPLICATION_PORT = 3001

export class App {
  app: INestApplication
  document: OpenAPIObject

  async init() {
    console.log('Starting application')
    console.log(`Node version ${process.version}`)
    await this.initApp()
    await this.initSwagger()
    console.log('Successfully initialized application')
  }

  private async initApp() {
    this.app = await NestFactory.create(AppModule)
    this.app.setGlobalPrefix('api', { exclude: [''] })
    this.app.useGlobalPipes(new ValidationPipe())
    this.app.enableCors()
    this.app.use(cookieParser())
    this.app.use(
      session({ secret: process.env.COOKIE_SESSION_SECRET as string }),
    )
    this.app.use(passport.session())
  }

  private async initSwagger() {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Moment Backend')
      .setDescription('Be in the moment')
      .setVersion('1.0')
      .build()
    this.document = SwaggerModule.createDocument(this.app, swaggerConfig)
    SwaggerModule.setup('api', this.app, this.document)
  }

  async listen() {
    await this.app.listen(APPLICATION_PORT)
  }
}
