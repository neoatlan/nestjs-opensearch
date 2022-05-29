# nestjs-opensearch
OpenSearch module for NestJS framework

## Installation
For NPM:
```bash
$ npm i --save nestjs-opensearch @opensearch-project/opensearch
```
For Yarn:
```bash
$ yarn add nestjs-opensearch @opensearch-project/opensearch
```

## Usage
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
    OpensearchModule.forRoot([
      {
        clientName: 'foo',
        node: 'https://*****.es.amazonaws.com',
      },
      {
        clientName: 'bar',
        node: 'https://*****.es.amazonaws.com',
      },
    ]),
  ],
  providers: (...),
})
export class SearchModule { }
```

Module for async configuration:
```typescript
import { OpensearchModule } from 'nestjs-opensearch';

@Module({
  imports: [
    // See also: https://docs.nestjs.com/techniques/configuration
    ConfigModule,
    OpensearchModule.forRootAsync({
      clientName: 'baz',
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

Client injection:
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
