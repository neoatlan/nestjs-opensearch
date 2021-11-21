export function buildInjectionToken(clientName: string | symbol) {
  return `OPENSEARCH_CLIENT_${String(clientName)}`;
}
