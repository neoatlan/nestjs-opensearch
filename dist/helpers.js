"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientName = exports.buildInjectionToken = void 0;
const symbols_1 = require("./symbols");
function buildInjectionToken(clientName) {
    return `OPENSEARCH_CLIENT_${String(clientName)}`;
}
exports.buildInjectionToken = buildInjectionToken;
function getClientName(client) {
    return client[symbols_1.clientNameSym];
}
exports.getClientName = getClientName;
