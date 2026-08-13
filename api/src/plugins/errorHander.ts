import type { FastifyError, FastifyInstance } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

import {
    ComponentNotFoundError,
    MockNotFoundError,
    ProjectNotFoundError,
    TemplateNotFoundError,
    VariableNotFoundError,
} from '../errors/index.js';

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: FastifyError, request, reply) => {
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

        if (error instanceof ComponentNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'COMPONENT_NOT_FOUND',
            });
        }

        if (error instanceof MockNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'MOCK_NOT_FOUND',
            });
        }

        if (error instanceof VariableNotFoundError) {
            return reply.status(404).send({
                error: 'Not Found',
                message: error.message,
                code: 'VARIABLE_NOT_FOUND',
            });
        }

        if (error.code === 'FST_ERR_CTP_INVALID_JSON_BODY') {
            return reply.status(400).send({
                error: 'Bad Request',
                message: 'Invalid JSON body',
                code: 'INVALID_JSON_BODY',
            });
        }

        if (error.code === 'FST_ERR_CTP_INVALID_JSON_BODY') {
            return reply.status(400).send({
                error: 'Bad Request',
                message: 'Invalid JSON body',
                code: 'INVALID_JSON_BODY',
            });
        }

        if (isUniqueConstraintViolationError(error)) {
            return reply.status(409).send({
                error: 'Conflict',
                message: 'A resource with the same name already exists in this project.',
                code: 'RESOURCE_NAME_ALREADY_EXISTS',
            });
        }

        if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
            return reply.status(413).send({
                error: 'Payload Too Large',
                message: 'The uploaded file is too large.',
                code: 'FILE_TOO_LARGE',
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

function isUniqueConstraintViolationError(error: FastifyError) {
    const cause = 'cause' in error ? error.cause : undefined;

    return (
        error.code === '23505' ||
        (typeof cause === 'object' && cause !== null && 'code' in cause && cause.code === '23505')
    );
}
