import type { FastifyInstance } from 'fastify';

import { versionWatcher } from '../services/VersionWatcher.js';

export async function versionRoutes(app: FastifyInstance) {
    app.get('/api/version', async (_, reply) => {
        return reply.send({ version: versionWatcher.getVersion() });
    });
}
