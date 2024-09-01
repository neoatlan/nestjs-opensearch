// Disable for tests
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Injectable, Module, Optional } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientOptions } from '@opensearch-project/opensearch';
import {
  InjectOpensearchClient,
  OpensearchClient,
  OpensearchModule,
  OpensearchClientOptionsFactory,
} from 'nestjs-opensearch';
import { getClientName } from 'nestjs-opensearch/helpers';

@Injectable()
class SearchService {
  public constructor(
    @Optional()
    public readonly defaultClient?: OpensearchClient,

    @Optional()
    @InjectOpensearchClient()
    public readonly defaultClient1?: OpensearchClient,

    @Optional()
    @InjectOpensearchClient('foo')
    public readonly fooClient?: OpensearchClient,

    @Optional()
    @InjectOpensearchClient('bar')
    public readonly barClient?: OpensearchClient,
  ) { }
}

@Module({
  providers: [{
    provide: 'node',
    useValue: 'http://localhost:9201',
  }],
  exports: [ 'node' ],
})
class ConfigModuleA { }

@Module({
  providers: [{
    provide: 'node',
    useValue: 'http://localhost:9202',
  }],
  exports: [ 'node' ],
})
class ConfigModuleB { }

@Injectable()
class ConfigServiceA implements OpensearchClientOptionsFactory {
  public createOpensearchClientOptions(): ClientOptions {
    return {
      node: 'http://localhost:9201',
    };
  }
}

@Injectable()
class ConfigServiceB implements OpensearchClientOptionsFactory {
  public createOpensearchClientOptions(): ClientOptions {
    return {
      node: 'http://localhost:9202',
    };
  }
}

describe('Client injections', () => {
  let _tm: TestingModule | null = null;

  afterEach(async () => {
    await _tm?.close();
  });

  test('Only default client with sync module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRoot({
          node: 'http://localhost:9200',
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).not.toBeUndefined();
    expect(ss.defaultClient1).not.toBeUndefined();
    expect(ss.fooClient).toBeUndefined();
    expect(ss.barClient).toBeUndefined();
    expect(getClientName(ss.defaultClient!)).toBeUndefined();
    expect(getClientName(ss.defaultClient1!)).toBeUndefined();
  });

  test('Only foo named client with sync module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRoot({
          clientName: 'foo',
          node: 'http://localhost:9200',
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).toBeUndefined();
    expect(ss.defaultClient1).toBeUndefined();
    expect(ss.fooClient).not.toBeUndefined();
    expect(ss.barClient).toBeUndefined();
    expect(getClientName(ss.fooClient!)).toEqual('foo');
  });

  test('Only named clients with sync module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRoot({
          clientName: 'foo',
          node: 'http://localhost:9200',
        }),
        OpensearchModule.forRoot({
          clientName: 'bar',
          node: 'http://localhost:9200',
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).toBeUndefined();
    expect(ss.defaultClient1).toBeUndefined();
    expect(ss.fooClient).not.toBeUndefined();
    expect(ss.barClient).not.toBeUndefined();
    expect(getClientName(ss.fooClient!)).toEqual('foo');
    expect(getClientName(ss.barClient!)).toEqual('bar');
  });

  test('Only named clients with legacy style sync module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRoot([
          {
            clientName: 'foo',
            node: 'http://localhost:9200',
          },
          {
            clientName: 'bar',
            node: 'http://localhost:9200',
          },
        ]),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).toBeUndefined();
    expect(ss.defaultClient1).toBeUndefined();
    expect(ss.fooClient).not.toBeUndefined();
    expect(ss.barClient).not.toBeUndefined();
    expect(getClientName(ss.fooClient!)).toEqual('foo');
    expect(getClientName(ss.barClient!)).toEqual('bar');
  });

  test('Import config through async module imports', async () => {
    let nodeA, nodeB;

    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRootAsync({
          imports: [ ConfigModuleA ],
          inject: [ 'node' ],
          useFactory: async (node: string) => {
            nodeA = node;
            return { node };
          },
        }),
        OpensearchModule.forRootAsync({
          clientName: 'bar',
          imports: [ ConfigModuleB ],
          inject: [ 'node' ],
          useFactory: async (node: string) => {
            nodeB = node;
            return { node };
          },
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    expect(nodeA).toEqual('http://localhost:9201');
    expect(nodeB).toEqual('http://localhost:9202');

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).not.toBeUndefined();
    expect(ss.defaultClient1).not.toBeUndefined();
    expect(ss.fooClient).toBeUndefined();
    expect(ss.barClient).not.toBeUndefined();
    expect(getClientName(ss.defaultClient!)).toBeUndefined();
    expect(getClientName(ss.defaultClient1!)).toBeUndefined();
    expect(getClientName(ss.barClient!)).toEqual('bar');
  });

  test('Only default and bar named clients with async module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRootAsync({
          useFactory: async () => ({
            node: 'http://localhost:9200',
          }),
        }),
        OpensearchModule.forRootAsync({
          clientName: 'bar',
          useFactory: async () => ({
            node: 'http://localhost:9200',
          }),
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).not.toBeUndefined();
    expect(ss.defaultClient1).not.toBeUndefined();
    expect(ss.fooClient).toBeUndefined();
    expect(ss.barClient).not.toBeUndefined();
    expect(getClientName(ss.defaultClient!)).toBeUndefined();
    expect(getClientName(ss.defaultClient1!)).toBeUndefined();
    expect(getClientName(ss.barClient!)).toEqual('bar');
  });

  test('Only default and bar named clients with legacy style async module', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRootAsync([
          {
            useFactory: async () => ({
              node: 'http://localhost:9200',
            }),
          },
          {
            clientName: 'bar',
            useFactory: async () => ({
              node: 'http://localhost:9200',
            }),
          },
        ]),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).not.toBeUndefined();
    expect(ss.defaultClient1).not.toBeUndefined();
    expect(ss.fooClient).toBeUndefined();
    expect(ss.barClient).not.toBeUndefined();
    expect(getClientName(ss.defaultClient!)).toBeUndefined();
    expect(getClientName(ss.defaultClient1!)).toBeUndefined();
    expect(getClientName(ss.barClient!)).toEqual('bar');
  });

  test('default client and bar named client by async module with useClass', async () => {
    const testModule = _tm = await Test.createTestingModule({
      imports: [
        OpensearchModule.forRootAsync({
          useClass: ConfigServiceA,
        }),
        OpensearchModule.forRootAsync({
          clientName: 'foo',
          useClass: ConfigServiceB,
        }),
      ],
      providers: [ SearchService ],
    }).compile();

    const ss = testModule.get(SearchService);    
    expect(ss.defaultClient).not.toBeUndefined();
    expect(ss.defaultClient1).not.toBeUndefined();
    expect(ss.fooClient).not.toBeUndefined();
    expect(ss.barClient).toBeUndefined();
    expect(getClientName(ss.defaultClient!)).toBeUndefined();
    expect(getClientName(ss.defaultClient1!)).toBeUndefined();
    expect(getClientName(ss.fooClient!)).toEqual('foo');
  });
});
