import { Inject } from '@nestjs/common';
import { buildInjectionToken } from '../helpers';
import { OpensearchClient } from '../opensearch-client';

export const InjectOpensearchClient = (clientName?: string | symbol) =>
  Inject(clientName ? buildInjectionToken(clientName) : OpensearchClient);
