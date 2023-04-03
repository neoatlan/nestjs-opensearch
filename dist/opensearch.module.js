"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OpensearchModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpensearchModule = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("./helpers");
const opensearch_client_1 = require("./opensearch-client");
const symbols_1 = require("./symbols");
let OpensearchModule = OpensearchModule_1 = class OpensearchModule {
    static forRoot(options) {
        const providers = OpensearchModule_1.buildProviders(options);
        return {
            module: OpensearchModule_1,
            exports: providers,
            providers,
        };
    }
    static forRootAsync(options) {
        const providers = OpensearchModule_1.buildAsyncProviders(options);
        return {
            module: OpensearchModule_1,
            imports: Array.isArray(options) ? undefined : options.imports,
            exports: providers,
            providers,
        };
    }
    static buildProviders(options) {
        if (!Array.isArray(options)) {
            return OpensearchModule_1.buildProviders([options]);
        }
        return options.map((option) => ({
            provide: option.clientName ? (0, helpers_1.buildInjectionToken)(option.clientName) : opensearch_client_1.OpensearchClient,
            inject: [symbols_1.clientMapSym],
            useFactory: (clientMap) => {
                const client = new opensearch_client_1.OpensearchClient(option);
                clientMap.set(option.clientName, client);
                return client;
            },
        }));
    }
    static buildAsyncProviders(options) {
        if (!Array.isArray(options)) {
            return OpensearchModule_1.buildAsyncProviders([options]);
        }
        return options.map((option) => ({
            provide: option.clientName ? (0, helpers_1.buildInjectionToken)(option.clientName) : opensearch_client_1.OpensearchClient,
            inject: [symbols_1.clientMapSym, ...(option.inject || [])],
            useFactory: async (clientMap, ...args) => {
                const clientOptions = await option.useFactory(...args);
                const client = new opensearch_client_1.OpensearchClient(Object.assign(Object.assign({}, clientOptions), { clientName: option.clientName }));
                clientMap.set(option.clientName, client);
                return client;
            },
        }));
    }
    constructor(clientMap) {
        this.clientMap = clientMap;
    }
    async onApplicationShutdown() {
        const promises = [];
        this.clientMap.forEach((client, clientName) => {
            promises.push((async () => {
                try {
                    await client.close();
                }
                catch (_a) {
                    /* Ignore */
                }
                this.clientMap.delete(clientName);
            })());
        });
        await Promise.all(promises);
    }
};
OpensearchModule = OpensearchModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: symbols_1.clientMapSym,
                useValue: new Map(),
            },
        ],
    }),
    __param(0, (0, common_1.Inject)(symbols_1.clientMapSym)),
    __metadata("design:paramtypes", [Object])
], OpensearchModule);
exports.OpensearchModule = OpensearchModule;
