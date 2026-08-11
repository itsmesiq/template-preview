import type { FastifyInstance } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

import { ProjectNotFoundError, TemplateNotFoundError } from '../errors/index.js';

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error, request, reply) => {
        if (hasZodFastifySchemaValidationErrors(error)) {
            return reply.status(400).send({
                error: 'Bad Request',
                message: 'Request validation failed',
                code: 'VALIDATION_ERROR',
            });
        }

        if (error instanceof ProjectNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'PROJECT_NOT_FOUND',
            });
        }

        if (error instanceof TemplateNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'TEMPLATE_NOT_FOUND',
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
