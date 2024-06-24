import Fastify from "fastify";
import cors from "@fastify/cors";
import db from "./plugins/db";
import usersRoutes from "./routes/users";
import slotsRoutes from "./routes/slots";
import callsRoutes from "./routes/calls";

const fastify = Fastify({ logger: true });

fastify.register(cors);
fastify.register(db);
fastify.register(usersRoutes);
fastify.register(slotsRoutes);
fastify.register(callsRoutes);

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
