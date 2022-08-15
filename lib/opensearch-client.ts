import { Client } from '@opensearch-project/opensearch';
import type { OpensearchClientOptions } from './interfaces';
import { clientNameSym } from './symbols';

export class OpensearchClient extends Client {
  public readonly [clientNameSym]?: string | symbol;

  public constructor({ clientName, ...clientOptions }: OpensearchClientOptions) {
    super(clientOptions);
    this[clientNameSym] = clientName;
  }
}
