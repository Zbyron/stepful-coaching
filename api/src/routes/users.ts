import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface UserBody {
  name: string;
  role: 'coach' | 'student';
  phone_number: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post('/users', async (request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) => {
    const { name, role, phone_number } = request.body;
    const { rows } = await fastify.pg.query(
      'INSERT INTO users (name, role, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [name, role, phone_number]
    );
    return rows[0];
  });

  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const { rows } = await fastify.pg.query('SELECT * FROM users');
    return rows;
  });

  fastify.get('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { rows } = await fastify.pg.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  });

  fastify.put('/users/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: UserBody }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { name, role, phone_number } = request.body;
    const { rows } = await fastify.pg.query(
      'UPDATE users SET name = $1, role = $2, phone_number = $3 WHERE id = $4 RETURNING *',
      [name, role, phone_number, id]
    );
    return rows[0];
  });

  fastify.delete('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { rowCount } = await fastify.pg.query('DELETE FROM users WHERE id = $1', [id]);
    return { deleted: rowCount > 0 };
  });
}