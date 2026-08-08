import type { FastifyInstance } from 'fastify';

import { mockService } from '../services/MockService.js';

export async function mocksRoutes(app: FastifyInstance) {
    app.get('/api/mocks', async (_, reply) => {
        const mocks = await mockService.list();

        return reply.send(mocks);
    });
}
