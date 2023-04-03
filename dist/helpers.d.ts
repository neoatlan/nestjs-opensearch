import type { OpensearchClient } from './opensearch-client';
export declare function buildInjectionToken(clientName: string | symbol): string;
export declare function getClientName(client: OpensearchClient): string | symbol | undefined;
