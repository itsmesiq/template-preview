import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import {
    jsonSchemaTransform,
    jsonSchemaTransformObject,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env.js';

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
            servers: [
                {
                    description: 'API Base URL',
                    url: env.API_BASE_URL,
                },
            ],
        },

        transform: jsonSchemaTransform,

        transformObject: jsonSchemaTransformObject,
    });

    await app.register(fastifyApiReference, {
        routePrefix: DOCUMENTATION_ROUTE,

        configuration: {
            sources: [
                {
                    title: 'Template Preview API',
                    slug: 'template-preview-api',
                    url: '/swagger.json',
                },
                {
                    title: 'Auth API',
                    slug: 'auth-api',
                    url: '/api/auth/open-api/generate-schema',
                },
            ],
            theme: 'saturn',
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/swagger.json',
        schema: {
            hide: true,
        },
        handler: async () => {
            return app.swagger();
        },
    });
}
