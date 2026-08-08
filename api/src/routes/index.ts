import type { FastifyInstance } from 'fastify';

import { mocksRoutes } from './mocks.js';
import { previewRoutes } from './preview.js';
import { templateRoutes } from './templates.js';
import { versionRoutes } from './version.js';

export async function registerRoutes(app: FastifyInstance) {
    await app.register(previewRoutes);
    await app.register(templateRoutes);
    await app.register(mocksRoutes);
    await app.register(versionRoutes);
}
