import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

export class App {
  app
  swaggerConfig

  async init() {
    await this.initApp()
    await this.initSwagger()
  }

  private async initApp() {
    this.app = await NestFactory.create(AppModule)
    this.app.setGlobalPrefix('api', { exclude: [''] })
  }

  private async initSwagger() {
    this.swaggerConfig = new DocumentBuilder()
      .setTitle('Moment Backend Server')
      .setDescription('Be in the moment')
      .setVersion('1.0')
    const document = SwaggerModule.createDocument(
      this.app,
      this.swaggerConfig.build(),
    )
    SwaggerModule.setup('api', this.app, document)
  }

  async listen() {
    await this.app.listen(3333)
  }
}
