import type { FastifyInstance } from 'fastify';

import { templateService } from '../services/TemplateService.js';

export async function templateRoutes(app: FastifyInstance) {
    app.get('/api/templates', async (_, reply) => {
        const templates = await templateService.list();

        return reply.send(templates);
    });
}
