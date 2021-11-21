# nestjs-opensearch
OpenSearch (alternative to Elasticsearch) module for NestJS framework

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
Module for only one connection:
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

Module for multiple connection:
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

Client injection:
```typescript
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';

@Injectable()
export class SearchService {
  public constructor(
    // For default
    private readonly searchClient: OpensearchClient,

    // Also for default
    @InjectOpensearchClient() private readonly searchClient: OpensearchClient,

    // For 'foo' client
    @InjectOpensearchClient('foo') private readonly searchClient: OpensearchClient,
  ) { }
}
```

