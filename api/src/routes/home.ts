import type { FastifyInstance } from 'fastify';

export async function homeRoutes(app: FastifyInstance) {
    app.get('/', async (_, reply) => {
        return reply.sendFile('preview.html');
    });
}
