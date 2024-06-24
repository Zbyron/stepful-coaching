"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(fastify) {
  fastify.post("/calls", async (request, reply) => {
    const { slot_id, coach_id, student_id, satisfaction, notes } = request.body;
    const { rows } = await fastify.pg.query(
      "INSERT INTO calls (slot_id, coach_id, student_id, satisfaction, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [slot_id, coach_id, student_id, satisfaction, notes]
    );
    return rows[0];
  });
  fastify.get("/calls", async (request, reply) => {
    const { rows } = await fastify.pg.query(`
      SELECT c.*, s.start_time, s.end_time, stu.name as student_name, stu.phone_number as student_phone, coa.name as coach_name, coa.phone_number as coach_phone
      FROM calls c
      JOIN slots s ON c.slot_id = s.id
      JOIN users stu ON c.student_id = stu.id
      JOIN users coa ON c.coach_id = coa.id
    `);
    return rows;
  });
  fastify.get("/calls/:id", async (request, reply) => {
    const { id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT c.*, s.start_time, s.end_time, stu.name as student_name, stu.phone_number as student_phone, coa.name as coach_name, coa.phone_number as coach_phone
      FROM calls c
      JOIN slots s ON c.slot_id = s.id
      JOIN users stu ON c.student_id = stu.id
      JOIN users coa ON c.coach_id = coa.id
      WHERE c.id = $1
    `,
      [id]
    );
    return rows[0];
  });
  fastify.put("/calls/:id", async (request, reply) => {
    const { id } = request.params;
    const { slot_id, coach_id, student_id, satisfaction, notes } = request.body;
    const { rows } = await fastify.pg.query(
      "UPDATE calls SET slot_id = $1, coach_id = $2, student_id = $3, satisfaction = $4, notes = $5 WHERE id = $6 RETURNING *",
      [slot_id, coach_id, student_id, satisfaction, notes, id]
    );
    return rows[0];
  });
  fastify.delete("/calls/:id", async (request, reply) => {
    const { id } = request.params;
    const { rowCount } = await fastify.pg.query(
      "DELETE FROM calls WHERE id = $1",
      [id]
    );
    return { deleted: rowCount > 0 };
  });
  fastify.get("/calls/coach/:coach_id/pending", async (request, reply) => {
    const { coach_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT c.*, s.start_time, s.end_time, stu.name as student_name, stu.phone_number as student_phone, coa.name as coach_name, coa.phone_number as coach_phone
      FROM calls c
      JOIN slots s ON c.slot_id = s.id
      JOIN users stu ON c.student_id = stu.id
      JOIN users coa ON c.coach_id = coa.id
      WHERE c.coach_id = $1 AND c.satisfaction IS NULL
    `,
      [coach_id]
    );
    return rows;
  });
  fastify.get("/calls/coach/:coach_id/history", async (request, reply) => {
    const { coach_id } = request.params;
    const { rows } = await fastify.pg.query(
      `
      SELECT c.*, s.start_time, s.end_time, stu.name as student_name, stu.phone_number as student_phone, coa.name as coach_name, coa.phone_number as coach_phone
      FROM calls c
      JOIN slots s ON c.slot_id = s.id
      JOIN users stu ON c.student_id = stu.id
      JOIN users coa ON c.coach_id = coa.id
      WHERE c.coach_id = $1
    `,
      [coach_id]
    );
    return rows;
  });
}
