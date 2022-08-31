import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common'
import { ClientOptions } from 'hot-shots'

import { MetricsService } from './metric.service'

export type MetricsModuleOptions = ClientOptions

interface MetricsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<MetricsModuleOptions> | MetricsModuleOptions
  inject?: any[]
}

const METRICS_MODULE_OPTIONS = 'metrics:module-options'

@Global()
@Module({})
export class MetricsModule {
  public static forRootAsync(
    options: MetricsModuleAsyncOptions,
  ): DynamicModule {
    const MetricsServiceFactoryProvider: Provider<MetricsService> = {
      provide: MetricsService,
      useFactory: (options: MetricsModuleOptions) =>
        new MetricsService(options),
      inject: [METRICS_MODULE_OPTIONS],
    }

    return {
      module: MetricsModule,
      imports: options.imports,
      providers: this.createAsyncProviders(options).concat(
        MetricsServiceFactoryProvider,
      ),
      exports: [MetricsServiceFactoryProvider],
    }
  }

  private static createAsyncProviders(
    options: MetricsModuleAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: METRICS_MODULE_OPTIONS,
        useFactory: async (...args: any[]) => await options.useFactory(...args),
        inject: options.inject || [],
      },
    ]
  }
}
