import type { FastifyInstance } from 'fastify';

import { listMocks } from '../loaders/listMocks.js';

export async function mocksRoutes(app: FastifyInstance) {
    app.get('/api/mocks', async (_, reply) => {
        const mocks = await listMocks();

        return reply.send(mocks);
    });
}
