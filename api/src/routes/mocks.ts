import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { ErrorSchema, MocksResponseSchema } from '../schemas/index.js';
import { mockService } from '../services/MockService.js';

export async function mocksRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/api/mocks',

        schema: {
            operationId: 'listMocks',
            tags: ['mocks'],
            summary: 'List all available mocks',
            response: {
                200: MocksResponseSchema,
                500: ErrorSchema,
            },
        },

        handler: async (_, reply) => {
            try {
                const mocks = await mockService.list();

                return reply.status(200).send(mocks);
            } catch (error) {
                app.log.error(error, 'Failed to list mocks');

                return reply.status(500).send({
                    error: 'Internal Server Error',
                    message: 'An unexpected error occurred.',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        },
    });
}
