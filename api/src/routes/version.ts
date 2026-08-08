import { FastifyInstance } from 'fastify';

export async function versionRoutes(app: FastifyInstance) {
    app.get('/api/version', async (_, reply) => {
        reply.send({ version });
    });
}
