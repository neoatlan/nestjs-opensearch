"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectOpensearchClient = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../helpers");
const opensearch_client_1 = require("../opensearch-client");
const InjectOpensearchClient = (clientName) => (0, common_1.Inject)(clientName ? (0, helpers_1.buildInjectionToken)(clientName) : opensearch_client_1.OpensearchClient);
exports.InjectOpensearchClient = InjectOpensearchClient;
