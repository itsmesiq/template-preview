import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '../plugins/requireAuth.js';
import { ErrorSchema, PreviewParamsSchema, PreviewQuerySchema } from '../schemas/index.js';
import { previewTemplate } from '../usecases/PreviewTemplate.js';

export async function previewRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/preview/:templateId',
        preHandler: [requireAuth],
        schema: {
            operationId: 'renderPreview',
            tags: ['Preview'],
            summary: 'Render a template preview',
            params: PreviewParamsSchema,
            querystring: PreviewQuerySchema,
            response: {
                200: {
                    'text/html': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
                404: ErrorSchema,
                500: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { projectId, templateId } = request.params;
            const { mock: mockId } = request.query;

            const body = await previewTemplate({
                projectId,
                templateId,
                mockId,
                userId: request.user!.id,
            });

            // TODO: Add a proper HTML template for the preview page
            return reply.status(200).send(`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin:0;padding:0;">
                    ${body}
                </body>
            </html>`);
        },
    });
}
