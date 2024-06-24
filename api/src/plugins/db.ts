import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyPostgres, {
    connectionString: "postgres://postgres:postgres@localhost:5432/stepfuldb",
  });
});
