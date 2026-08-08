import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { ErrorSchema, TemplatesResponseSchema } from '../schemas/index.js';
import { templateService } from '../services/TemplateService.js';

export async function templateRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/api/templates',

        schema: {
            operationId: 'listTemplates',
            tags: ['Templates'],
            summary: 'List all available templates',

            response: {
                200: TemplatesResponseSchema,
                500: ErrorSchema,
            },
        },
        handler: async (_, reply) => {
            try {
                const templates = await templateService.list();

                return reply.status(200).send(templates);
            } catch (error) {
                app.log.error(error, 'Failed to list templates');

                return reply.status(500).send({
                    error: 'Internal Server Error',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        },
    });
}
