import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { logger } from './config/logger.js';
import { versionWatcher } from './services/VersionWatcher.js';
import { paths } from './utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({
    logger,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
});

versionWatcher.start([path.join(paths.templates), path.join(paths.mock), path.join(paths.src)]);

app.get('/', async (_, reply) => {
    return await reply.sendFile('preview.html');
});

try {
    await app.listen({
        port: 3000,
    });

    console.log('🚀 http://localhost:3000');
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
