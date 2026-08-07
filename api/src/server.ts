import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";

import { render } from "./engine/index.js";
import { listTemplates } from "./engine/renderer/listTemplates.js";
import { listMocks } from "./loaders/listMocks.js";
import { loadMock } from "./loaders/loadMock.js";
import { paths } from "./utils/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({
    logger: true,
});

await app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
});

let version = Date.now();

chokidar.watch(
    [
        path.join(paths.templates),
        path.join(paths.mock),
        path.join(paths.src),
    ],
    {
        ignoreInitial: true,
    },
)
.on("all", (_, file) => {
    version = Date.now();
    console.log(`File changed: ${file}. Version updated to ${version}`);
});

app.get("/", async (_, reply ) => {
    return await reply.sendFile("preview.html");
});

app.get("/api/templates", async (_, reply) => {
    const templates = await listTemplates();

    reply.send(templates);
});

app.get("/api/mocks", async (_, reply) => {
    const mocks = await listMocks();

    reply.send(mocks);
});

app.get("/api/version", async (_, reply) => {
    reply.send({ version });
});

app.get("/preview/:template", async (request, reply) => {
    const { template } = request.params as { template: string };
    const { mock = "default"} = request.query as { mock?: string };

    try {
        const context = await loadMock(mock);

        const body = await render(template,context,);

        reply.type("text/html").send(`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin:0;padding:0;">
                    ${body}
                </body>
            </html>`);
        
    } catch (error) {
        app.log.error(error);

        reply
            .status(500)
            .type("text/html")
            .send(`
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

try {
    await app.listen({
        port: 3000,
    });

    console.log("🚀 http://localhost:3000");
} catch (err) {
    app.log.error(err);
    process.exit(1);
}