import { Client } from '@opensearch-project/opensearch';
import type { OpensearchClientOptions } from './interfaces';
import { clientNameSym } from './symbols';
export declare class OpensearchClient extends Client {
    readonly [clientNameSym]?: string | symbol;
    constructor({ clientName, ...clientOptions }: OpensearchClientOptions);
}
