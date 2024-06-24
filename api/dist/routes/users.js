"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(fastify) {
  fastify.post("/users", async (request, reply) => {
    const { name, role, phone_number } = request.body;
    const { rows } = await fastify.pg.query(
      "INSERT INTO users (name, role, phone_number) VALUES ($1, $2, $3) RETURNING *",
      [name, role, phone_number]
    );
    return rows[0];
  });
  fastify.get("/users", async (request, reply) => {
    const { rows } = await fastify.pg.query("SELECT * FROM users");
    return rows;
  });
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params;
    const { rows } = await fastify.pg.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return rows[0];
  });
  fastify.put("/users/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, role, phone_number } = request.body;
    const { rows } = await fastify.pg.query(
      "UPDATE users SET name = $1, role = $2, phone_number = $3 WHERE id = $4 RETURNING *",
      [name, role, phone_number, id]
    );
    return rows[0];
  });
  fastify.delete("/users/:id", async (request, reply) => {
    const { id } = request.params;
    const { rowCount } = await fastify.pg.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );
    return { deleted: rowCount > 0 };
  });
}
