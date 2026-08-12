import type { FastifyInstance } from 'fastify';

import { authRoutes } from './auth.js';
import { componentRoutes } from './components.js';
import { homeRoutes } from './home.js';
import { mocksRoutes } from './mocks.js';
import { previewRoutes } from './preview.js';
import { projectsRoutes } from './projects.js';
import { templateRoutes } from './templates.js';
import { versionRoutes } from './version.js';

export async function registerRoutes(app: FastifyInstance) {
    await app.register(authRoutes);
    await app.register(previewRoutes);
    await app.register(templateRoutes);
    await app.register(mocksRoutes);
    await app.register(versionRoutes);
    await app.register(homeRoutes);
    await app.register(projectsRoutes);
    await app.register(componentRoutes);
}
