import type { FastifyInstance } from 'fastify';

import { ProjectNotFoundError } from '../errors/index.js';

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error, request, reply) => {
        if (error instanceof ProjectNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'PROJECT_NOT_FOUND',
            });
        }

        request.log.error(error);

        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
            code: 'INTERNAL_SERVER_ERROR',
        });
    });
}
