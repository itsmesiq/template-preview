import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { previewEngine } from '../engine/index.js';
import { TemplateNotFoundError } from '../errors/index.js';
import { ErrorSchema, PreviewParamsSchema, PreviewQuerySchema } from '../schemas/index.js';

export async function previewRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/preview/:template',
        schema: {
            operationId: 'renderPreview',
            tags: ['Preview'],
            summary: 'Render a template preview',

            params: PreviewParamsSchema,
            querystring: PreviewQuerySchema,

            response: {
                200: z.string(),
                404: ErrorSchema,
                500: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { template } = request.params;
            const { mock } = request.query;

            try {
                const body = await previewEngine.render({ template, mock });

                // TODO:
                // Mover para um renderer/layout
                return reply.type('text/html').send(`<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="margin:0;padding:0;">
                        ${body}
                    </body>
                </html>`);
            } catch (error) {
                if (error instanceof TemplateNotFoundError) {
                    app.log.warn({ template, mock }, 'Template not found');

                    return reply.status(404).send({
                        error: error.message,
                        code: 'TEMPLATE_NOT_FOUND',
                    });
                }

                app.log.error(
                    {
                        error,
                        template,
                        mock,
                    },
                    'Failed to render preview',
                );

                return reply.status(500).type('text/html').send(`
                    <div style="
                        padding:40px;
                        font-family:Inter,Arial,sans-serif;
                        color:#dc2626;
                    ">
                        <h2>Erro ao renderizar</h2>

                        <pre>${String(error)}</pre>
                    </div>
                `);
            }
        },
    });
}
