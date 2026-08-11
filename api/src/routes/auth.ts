import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';

import { auth } from '../lib/auth.js';

export async function authRoutes(app: FastifyInstance) {
    app.route({
        method: ['GET', 'POST'],
        url: '/api/auth/*',
        handler: async (request, reply) => {
            try {
                const url = new URL(request.url, `http://${request.headers.host}`);
                const headers = fromNodeHeaders(request.headers);
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    ...(request.body ? { body: JSON.stringify(request.body) } : {}),
                });

                const response = await auth.handler(req);

                reply.status(response.status);

                response.headers.forEach((value, key) => {
                    reply.header(key, value);
                });

                return reply.send(response.body ? await response.text() : null);
            } catch (error) {
                app.log.error({ error }, 'Error handling auth request');

                return reply.status(500).send({
                    error: 'Internal authentication error',
                    code: 'AUTH_FAILURE',
                });
            }
        },
    });
}
