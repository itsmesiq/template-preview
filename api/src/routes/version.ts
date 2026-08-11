import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { ErrorSchema, VersionResponseSchema } from '../schemas/index.js';
import { versionWatcher } from '../services/VersionWatcher.js';

export async function versionRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/api/version',

        schema: {
            operationId: 'getVersion',
            tags: ['System'],
            summary: 'Get the current preview version',
            response: {
                200: VersionResponseSchema,
                500: ErrorSchema,
            },
        },
        handler: async (_, reply) => {
            try {
                const version = versionWatcher.getVersion();

                return reply.status(200).send({ version });
            } catch (error) {
                app.log.error(error, 'Failed to get version');

                return reply.status(500).send({
                    error: 'Internal Server Error',
                    message: 'An unexpected error occurred.',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        },
    });
}
