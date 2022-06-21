import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { OpenApiNestFactory } from 'nest-openapi-tools'

import { App } from './app.Main'
;(async () => {
  const app = new App()
  await app.init()

  await OpenApiNestFactory.configure(
    app.app,
    app.swaggerConfig,
    {
      fileGeneratorOptions: {
        enabled: true,
        outputFilePath: './openapi.json',
      },
      clientGeneratorOptions: {
        enabled: false,
        type: 'typescript-axios',
        outputFolderPath: '../../api-client/src',
        additionalProperties:
          'apiPackage=@moment/api-client,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true',
        openApiFilePath: './openapi.json',
        skipValidation: true,
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method,
    },
  )
})()
