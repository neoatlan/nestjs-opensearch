import { DynamicModule, Inject, Module, OnApplicationShutdown, Provider } from '@nestjs/common';
import { buildInjectionToken } from './helpers';
import type { OpensearchClientOptions, OpensearchAsyncClientOptions } from './interfaces';
import { OpensearchClient } from './opensearch-client';
import { clientMapSym } from './symbols';
/* eslint-disable @typescript-eslint/no-explicit-any */

type ClientMap = Map<string | symbol | undefined, OpensearchClient>;

@Module({
  providers: [
    {
      provide: clientMapSym,
      useValue: new Map<string | symbol | undefined, OpensearchClient>(),
    },
  ],
})
export class OpensearchModule implements OnApplicationShutdown {
  public static forRoot(options: OpensearchClientOptions): DynamicModule;
  /** @deprecated Please call forRoot() multiple times instead of using an array */
  public static forRoot(options: OpensearchClientOptions[]): DynamicModule;
  public static forRoot(options: OpensearchClientOptions | OpensearchClientOptions[]): DynamicModule {
    const providers = OpensearchModule.buildProviders(options);
    return {
      module: OpensearchModule,
      exports: providers,
      providers,
    };
  }

  public static forRootAsync(options: OpensearchAsyncClientOptions): DynamicModule;
  /** @deprecated Please call forRootAsync() multiple times instead of using an array */
  public static forRootAsync(options: OpensearchAsyncClientOptions[]): DynamicModule;
  public static forRootAsync(options: OpensearchAsyncClientOptions | OpensearchAsyncClientOptions[]): DynamicModule {
    const providers = OpensearchModule.buildAsyncProviders(options);
    return {
      module: OpensearchModule,
      imports: Array.isArray(options) ? undefined : options.imports,
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
      inject: [ clientMapSym ],
      useFactory: (clientMap: ClientMap) => {
        const client = new OpensearchClient(option);
        clientMap.set(option.clientName, client);
        return client;
      },
    }));
  }

  private static buildAsyncProviders(options: OpensearchAsyncClientOptions | OpensearchAsyncClientOptions[]): Provider[] {
    if (!Array.isArray(options)) {
      return OpensearchModule.buildAsyncProviders([ options ]);
    }

    return options.map((option) => ({
      provide: option.clientName ? buildInjectionToken(option.clientName) : OpensearchClient,
      inject: [ clientMapSym, ...(option.inject || []) ],
      useFactory: async (clientMap: ClientMap, ...args: any[]) => {
        const clientOptions = await option.useFactory(...args);
        const client = new OpensearchClient({
          ...clientOptions,
          clientName: option.clientName,
        });
        clientMap.set(option.clientName, client);
        return client;
      },
    }));
  }

  public constructor(
    @Inject(clientMapSym)
    private readonly clientMap: ClientMap,
  ) { }

  public async onApplicationShutdown() {
    const promises: Promise<unknown>[] = [];

    this.clientMap.forEach((client, clientName) => {
      promises.push((async () => {
        try {
          await client.close();
        } catch {
          /* Ignore */
        }
        this.clientMap.delete(clientName);
      })());
    });

    await Promise.all(promises);
  }
}
