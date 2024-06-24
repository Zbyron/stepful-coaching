"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const db_1 = __importDefault(require("./plugins/db"));
const users_1 = __importDefault(require("./routes/users"));
const slots_1 = __importDefault(require("./routes/slots"));
const calls_1 = __importDefault(require("./routes/calls"));
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(cors_1.default);
fastify.register(db_1.default);
fastify.register(users_1.default);
fastify.register(slots_1.default);
fastify.register(calls_1.default);
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
