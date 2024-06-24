"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(fastify) {
  fastify.post("/slots", async (request, reply) => {
    const { coach_id, start_time, end_time } = request.body;
    const { rows } = await fastify.pg.query(
      "INSERT INTO slots (coach_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
      [coach_id, start_time, end_time]
    );
    return rows[0];
  });
  fastify.get("/slots", async (request, reply) => {
    const { rows } = await fastify.pg.query(`
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone, us.name as student_name, us.phone_number as student_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      LEFT JOIN users us ON s.student_id = us.id
    `);
    return rows;
  });
  fastify.get("/slots/:id", async (request, reply) => {
    const { id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone, us.name as student_name, us.phone_number as student_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      LEFT JOIN users us ON s.student_id = us.id
      WHERE s.id = $1
    `,
      [id]
    );
    return rows[0];
  });
  fastify.put("/slots/:id", async (request, reply) => {
    const { id } = request.params;
    const { coach_id, start_time, end_time } = request.body;
    const { rows } = await fastify.pg.query(
      "UPDATE slots SET coach_id = $1, start_time = $2, end_time = $3 WHERE id = $4 RETURNING *",
      [coach_id, start_time, end_time, id]
    );
    return rows[0];
  });
  fastify.delete("/slots/:id", async (request, reply) => {
    const { id } = request.params;
    const { rowCount } = await fastify.pg.query(
      "DELETE FROM slots WHERE id = $1",
      [id]
    );
    return { deleted: rowCount > 0 };
  });
  fastify.get("/slots/coach/:coach_id", async (request, reply) => {
    const { coach_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone, us.name as student_name, us.phone_number as student_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      LEFT JOIN users us ON s.student_id = us.id
        WHERE s.coach_id = $1
    `,
      [coach_id]
    );
    return rows;
  });
  fastify.patch("/slots/:id/book", async (request, reply) => {
    const { id } = request.params;
    const { student_id } = request.body;
    const { rows } = await fastify.pg.query(
      "UPDATE slots SET is_booked = TRUE, student_id = $1 WHERE id = $2 RETURNING *",
      [student_id, id]
    );
    return rows[0];
  });
  fastify.get("/slots/student/:student_id", async (request, reply) => {
    const { student_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      WHERE s.student_id = $1
    `,
      [student_id]
    );
    return rows;
  });
  fastify.get("/slots/coach/:coach_id/taken", async (request, reply) => {
    const { coach_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone, us.name as student_name, us.phone_number as student_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      LEFT JOIN users us ON s.student_id = us.id
      WHERE s.coach_id = $1 AND s.is_booked = TRUE
    `,
      [coach_id]
    );
    return rows;
  });
  fastify.get("/slots/coach/:coach_id/past", async (request, reply) => {
    const { coach_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT s.*, u.name as coach_name, u.phone_number as coach_phone, us.name as student_name, us.phone_number as student_phone
      FROM slots s
      LEFT JOIN users u ON s.coach_id = u.id
      LEFT JOIN users us ON s.student_id = us.id
      WHERE s.coach_id = $1 AND s.end_time < CURRENT_TIMESTAMP
    `,
      [coach_id]
    );
    return rows;
  });
}
