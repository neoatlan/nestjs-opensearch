import { DynamicModule, Module, Provider } from '@nestjs/common';
import { buildInjectionToken } from './helpers';
import type { OpensearchClientOptions, OpensearchAsyncClientOptions } from './interfaces';
import { OpensearchClient } from './opensearch-client';
/* eslint-disable @typescript-eslint/no-explicit-any */

@Module({})
export class OpensearchModule {
  public static forRoot(options: OpensearchClientOptions | OpensearchClientOptions[]): DynamicModule {
    const providers = OpensearchModule.buildProviders(options);
    return {
      module: OpensearchModule,
      exports: providers,
      providers,
    };
  }

  public static forRootAsync(options: OpensearchAsyncClientOptions | OpensearchAsyncClientOptions[]): DynamicModule {
    const providers = OpensearchModule.buildAsyncProviders(options);
    return {
      module: OpensearchModule,
      exports: providers,
      providers,
    };
  }

  private static buildProviders(options: OpensearchClientOptions | OpensearchClientOptions[]): Provider[] {
    if (!Array.isArray(options)) {
      return OpensearchModule.buildProviders([ options ]);
    }

    return options.map((option) => ({
      provide: option.clientName ? buildInjectionToken(option.clientName) : OpensearchClient,
      useValue: new OpensearchClient(option),
    }));
  }

  private static buildAsyncProviders(options: OpensearchAsyncClientOptions | OpensearchAsyncClientOptions[]): Provider[] {
    if (!Array.isArray(options)) {
      return OpensearchModule.buildAsyncProviders([ options ]);
    }

    return options.map((option) => ({
      provide: option.clientName ? buildInjectionToken(option.clientName) : OpensearchClient,
      inject: option.inject,
      useFactory: async (...args: any[]) => {
        const clientOptions = await option.useFactory(...args);
        return new OpensearchClient({
          ...clientOptions,
          clientName: option.clientName,
        });
      },
    }));
  }
}
