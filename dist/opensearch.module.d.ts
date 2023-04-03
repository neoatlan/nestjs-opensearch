import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import type { OpensearchClientOptions, OpensearchAsyncClientOptions } from './interfaces';
import { OpensearchClient } from './opensearch-client';
type ClientMap = Map<string | symbol | undefined, OpensearchClient>;
export declare class OpensearchModule implements OnApplicationShutdown {
    private readonly clientMap;
    static forRoot(options: OpensearchClientOptions): DynamicModule;
    /** @deprecated Please call forRoot() multiple times instead of using an array */
    static forRoot(options: OpensearchClientOptions[]): DynamicModule;
    static forRootAsync(options: OpensearchAsyncClientOptions): DynamicModule;
    /** @deprecated Please call forRootAsync() multiple times instead of using an array */
    static forRootAsync(options: OpensearchAsyncClientOptions[]): DynamicModule;
    private static buildProviders;
    private static buildAsyncProviders;
    constructor(clientMap: ClientMap);
    onApplicationShutdown(): Promise<void>;
}
export {};
