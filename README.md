<p align="center">
  <a href="http://nestjs.com/"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1 align="center">nestjs-opensearch</h1>
  <p align="center">
    OpenSearch module for NestJS framework
    <br />
    <a href="#installation"><strong>Installation</strong></a>
    ·
    <a href="#usage"><strong>Usage</strong></a>
    ·
    <a href="https://github.com/neoatlan/nestjs-opensearch/issues"><strong>Issues</strong></a>
    <br />
    <img src="https://img.shields.io/npm/v/nestjs-opensearch.svg" alt="NPM Version" />
    <img src="https://img.shields.io/npm/l/nestjs-opensearch.svg" alt="Package License" />
    <img src="https://img.shields.io/npm/dm/nestjs-opensearch.svg" alt="NPM Downloads" />
  </p>
  <br />
</p>

## Installation
For NPM:
```bash
$ npm i --save nestjs-opensearch @opensearch-project/opensearch
```
For Yarn:
```bash
$ yarn add nestjs-opensearch @opensearch-project/opensearch
```

## Module configuration
Module for single connection:
```typescript
import { OpensearchModule } from 'nestjs-opensearch';

@Module({
  imports: [
    OpensearchModule.forRoot({
      node: 'https://*****.es.amazonaws.com',
    }),
  ],
  providers: (...),
})
export class SearchModule { }
```

Module for multiple connections:
```typescript
import { OpensearchModule } from 'nestjs-opensearch';

@Module({
  imports: [
    OpensearchModule.forRoot({
      clientName: 'foo',
      node: 'https://*****.es.amazonaws.com',
    }),
    OpensearchModule.forRoot({
      clientName: 'bar',
      node: 'https://*****.es.amazonaws.com',
    }),
  ],
  providers: (...),
})
export class SearchModule { }
```

Module for async configuration using useFactory:
```typescript
import { OpensearchModule } from 'nestjs-opensearch';

@Module({
  imports: [
    OpensearchModule.forRootAsync({
      clientName: 'baz',
      // See also: https://docs.nestjs.com/techniques/configuration
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService) => ({
        node: configService.get<string>('opensearch.node'),
      }),
    }),
  ],
  providers: (...),
})
export class SearchModule { }
```

Module for async configuration using useClass:
```typescript
import type { ClientOptions } from '@opensearch-project/opensearch';
import { OpensearchModule, OpensearchClientOptionsFactory } from 'nestjs-opensearch';

@Injectable()
export class OpensearchConfigService implements OpensearchClientOptionsFactory {
  public async createOpensearchClientOptions(): Promise<ClientOptions> {
    const configs = await fetch(...);
    return {
      node: configs.node,
    };
  }
}

@Module({
  imports: [
    OpensearchModule.forRootAsync({
      clientName: 'qux',
      useClass: OpensearchConfigService,
    }),
  ],
  providers: (...),
})
export class SearchModule { }
```

## Client usage
```typescript
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';

@Injectable()
export class SearchService {
  public constructor(
    // Inject the default client
    private readonly searchClient: OpensearchClient,

    // Also inject the default client
    @InjectOpensearchClient()
    private readonly alsoSearchClient: OpensearchClient,

    // Inject the 'foo' named client
    @InjectOpensearchClient('foo')
    private readonly fooSearchClient: OpensearchClient,
  ) { }
}
```
