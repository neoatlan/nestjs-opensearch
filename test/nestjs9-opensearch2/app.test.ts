// Disable for tests
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Injectable, Optional } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectOpensearchClient, OpensearchClient, OpensearchModule } from 'nestjs-opensearch';
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

  test('Only default and bar named clients with async module', async () => {
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
});
