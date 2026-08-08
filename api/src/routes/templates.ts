import type { FastifyInstance } from 'fastify';

import { listTemplates } from '../engine/renderer/listTemplates.js';

export async function templateRoutes(app: FastifyInstance) {
    app.get('/api/templates', async (_, reply) => {
        const templates = await listTemplates();

        return reply.send(templates);
    });
}
