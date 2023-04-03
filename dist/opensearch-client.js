"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpensearchClient = void 0;
const opensearch_1 = require("@opensearch-project/opensearch");
const symbols_1 = require("./symbols");
class OpensearchClient extends opensearch_1.Client {
    constructor(_a) {
        var { clientName } = _a, clientOptions = __rest(_a, ["clientName"]);
        super(clientOptions);
        this[symbols_1.clientNameSym] = clientName;
    }
}
exports.OpensearchClient = OpensearchClient;
