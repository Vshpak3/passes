import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

export class App {
  app
  document

  async init() {
    await this.initApp()
    await this.initSwagger()
  }

  private async initApp() {
    this.app = await NestFactory.create(AppModule)
    this.app.setGlobalPrefix('api', { exclude: [''] })
    this.app.useGlobalPipes(new ValidationPipe())
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
    await this.app.listen(3001)
  }
}
