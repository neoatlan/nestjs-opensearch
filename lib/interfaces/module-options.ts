import type { ModuleMetadata, Type } from '@nestjs/common';
import type { ClientOptions } from '@opensearch-project/opensearch';
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface OpensearchClientOptions extends ClientOptions {
  clientName?: string | symbol;
}

type OpensearchAsyncClientOptionsBase = OpensearchClientOptions & Pick<ModuleMetadata, 'imports'>;

interface OpensearchAsyncClientOptionsUseFactory extends OpensearchAsyncClientOptionsBase {
  inject?: any[];
  useFactory: (...args: any[]) => ClientOptions | Promise<ClientOptions>;
}

export interface OpensearchClientOptionsFactory {
  createOpensearchClientOptions: () => ClientOptions | Promise<ClientOptions>;
}

interface OpensearchAsyncClientOptionsUseClass extends OpensearchAsyncClientOptionsBase {
  useClass: Type<OpensearchClientOptionsFactory>;
}

export type OpensearchAsyncClientOptions = OpensearchAsyncClientOptionsUseFactory | OpensearchAsyncClientOptionsUseClass;
