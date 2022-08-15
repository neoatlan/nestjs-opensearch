import type { OpensearchClient } from './opensearch-client';
import { clientNameSym } from './symbols';

export function buildInjectionToken(clientName: string | symbol) {
  return `OPENSEARCH_CLIENT_${String(clientName)}`;
}

export function getClientName(client: OpensearchClient) {
  return client[clientNameSym];
}
