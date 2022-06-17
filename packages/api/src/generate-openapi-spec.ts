import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { OpenApiNestFactory } from 'nest-openapi-tools'

import { AppModule } from './app.module'
;(async () => {
  const app = await NestFactory.create(AppModule)
  await OpenApiNestFactory.configure(
    app,
    new DocumentBuilder().setTitle('Moment API'),
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
