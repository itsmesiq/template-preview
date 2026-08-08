import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform, jsonSchemaTransformObject } from 'fastify-type-provider-zod';

const DOCUMENTATION_ROUTE = '/docs';

export async function registerSwagger(app: FastifyInstance) {
    await app.register(fastifySwagger, {
        openapi: {
            openapi: '3.1.0',
            info: {
                title: 'Email Preview API',
                description: 'Local preview server for Scriban email templates.',
                version: '1.0.0',
            },
        },

        transform: jsonSchemaTransform,

        transformObject: jsonSchemaTransformObject,
    });

    await app.register(fastifyApiReference, {
        routePrefix: DOCUMENTATION_ROUTE,

        configuration: {
            theme: 'purple',
        },
    });
}
