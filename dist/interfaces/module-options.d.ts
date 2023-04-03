import type { ModuleMetadata } from '@nestjs/common';
import type { ClientOptions } from '@opensearch-project/opensearch';
export interface OpensearchClientOptions extends ClientOptions {
    clientName?: string | symbol;
}
export interface OpensearchAsyncClientOptions extends Pick<ModuleMetadata, 'imports'> {
    clientName?: string | symbol;
    useFactory: (...args: any[]) => ClientOptions | Promise<ClientOptions>;
    inject?: any[];
}
