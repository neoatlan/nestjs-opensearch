import { Inject } from '@nestjs/common';
import { buildInjectionToken } from '../helpers';
import { OpensearchClient } from '../opensearch-client';

export const InjectOpensearchClient = (clientName?: string | symbol): ParameterDecorator =>
  Inject(clientName ? buildInjectionToken(clientName) : OpensearchClient);
