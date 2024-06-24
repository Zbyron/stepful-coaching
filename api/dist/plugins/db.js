"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(postgres_1.default, {
        connectionString: 'postgres://postgres:postgres@localhost:5432/stepfuldb',
    });
});
