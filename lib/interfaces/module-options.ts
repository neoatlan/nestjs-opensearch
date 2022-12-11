import type { ModuleMetadata } from '@nestjs/common';
import type { ClientOptions } from '@opensearch-project/opensearch';
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface OpensearchClientOptions extends ClientOptions {
  clientName?: string | symbol;
}

export interface OpensearchAsyncClientOptions extends Pick<ModuleMetadata, 'imports'> {
  clientName?: string | symbol;
  useFactory: (...args: any[]) => ClientOptions | Promise<ClientOptions>;
  inject?: any[];
}
