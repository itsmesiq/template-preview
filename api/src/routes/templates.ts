import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '../plugins/requireAuth.js';
import {
    CreateTemplateSchema,
    ErrorSchema,
    ProjectResourceParamsSchema,
    TemplateListSchema,
    TemplateParamsSchema,
    TemplateSchema,
    UpdateTemplateSchema,
} from '../schemas/index.js';
import { createTemplate } from '../usecases/CreateTemplate.js';
import { deleteTemplate } from '../usecases/DeleteTemplate.js';
import { getTemplate } from '../usecases/GetTemplate.js';
import { listTemplates } from '../usecases/ListTemplates.js';
import { updateTemplate } from '../usecases/UpdateTemplate.js';

export async function templateRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects/:projectId/templates',
        preHandler: requireAuth,
        schema: {
            operationId: 'createTemplate',
            tags: ['Templates'],
            summary: 'Create a new template for a project',
            params: ProjectResourceParamsSchema,
            body: CreateTemplateSchema,
            response: {
                201: TemplateSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content } = request.body;

            const template = await createTemplate({
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
            });

            return reply.status(201).send(template);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/templates',
        preHandler: requireAuth,
        schema: {
            operationId: 'listTemplates',
            tags: ['Templates'],
            summary: 'List all templates for a project',
            params: ProjectResourceParamsSchema,
            response: {
                200: TemplateListSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const templates = await listTemplates({
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(200).send(templates);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/templates/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'getTemplate',
            tags: ['Templates'],
            summary: 'Get a template by ID',
            params: TemplateParamsSchema,
            response: {
                200: TemplateSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const template = await getTemplate({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(200).send(template);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'PATCH',
        url: '/projects/:projectId/templates/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'updateTemplate',
            tags: ['Templates'],
            summary: 'Update a template by ID',
            params: TemplateParamsSchema,
            body: UpdateTemplateSchema,
            response: {
                200: TemplateSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content } = request.body;

            const template = await updateTemplate({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
            });

            return reply.status(200).send(template);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'DELETE',
        url: '/projects/:projectId/templates/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'deleteTemplate',
            tags: ['Templates'],
            summary: 'Delete a template by ID',
            params: TemplateParamsSchema,
            response: {
                204: z.null(),
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            await deleteTemplate({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(204).send(null);
        },
    });
}
