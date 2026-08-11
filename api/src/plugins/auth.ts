import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { auth } from '../lib/auth.js';

declare module 'fastify' {
    interface FastifyRequest {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    }
}

async function authPlugin(app: FastifyInstance) {
    app.decorateRequest('user', null);
    app.decorateRequest('session', null);

    app.addHook('preHandler', async (request: FastifyRequest) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(request.headers),
        });

        request.user = session?.user ?? null;
        request.session = session?.session ?? null;
    });
}

export default fp(authPlugin);
