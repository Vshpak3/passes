import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common'
import { ClientOptions, StatsD } from 'hot-shots'

export type MetricsModuleOptions = ClientOptions

export interface MetricsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<MetricsModuleOptions> | MetricsModuleOptions
  inject?: any[]
}

export const METRICS_MODULE_OPTIONS = 'metrics:module-options'

@Global()
@Module({})
export class MetricsModule {
  public static forRootAsync(
    options: MetricsModuleAsyncOptions,
  ): DynamicModule {
    const StatsDFactoryProvider: Provider<StatsD> = {
      provide: StatsD,
      useFactory: (options: MetricsModuleOptions) => new StatsD(options),
      inject: [METRICS_MODULE_OPTIONS],
    }

    return {
      module: MetricsModule,
      imports: options.imports,
      providers: this.createAsyncProviders(options).concat(
        StatsDFactoryProvider,
      ),
      exports: [StatsDFactoryProvider],
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
