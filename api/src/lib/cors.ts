import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export async function registerCors(app: FastifyInstance) {
    await app.register(fastifyCors, {
        origin: process.env.WEB_APP_BASE_URL,
        credentials: true,
    });
}
