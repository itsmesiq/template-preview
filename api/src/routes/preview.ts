import type { FastifyInstance } from 'fastify';

import { render } from '../engine/index.js';
import { loadMock } from '../loaders/loadMock.js';

export async function previewRoutes(app: FastifyInstance) {
    app.get('/preview/:template', async (request, reply) => {
        const { template } = request.params as { template: string };
        const { mock = 'default' } = request.query as { mock?: string };

        try {
            const context = await loadMock(mock);

            const body = await render(template, context);

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
    });
}
