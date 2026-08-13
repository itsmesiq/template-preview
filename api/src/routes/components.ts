import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '../plugins/requireAuth.js';
import {
    ComponentListSchema,
    ComponentParamsSchema,
    ComponentSchema,
    CreateComponentSchema,
    ErrorSchema,
    ProjectResourceParamsSchema,
    ReloadComponentJsonSchema,
    UpdateComponentSchema,
    UploadComponentSchema,
} from '../schemas/index.js';
import { createComponent } from '../usecases/CreateComponent.js';
import { deleteComponent } from '../usecases/DeleteComponent.js';
import { getComponent } from '../usecases/GetComponent.js';
import { listComponents } from '../usecases/ListComponent.js';
import { reloadComponentsJson } from '../usecases/ReloadComponentsJson.js';
import { updateComponent } from '../usecases/UpdateComponent.js';
import { uploadComponent } from '../usecases/UploadComponent.js';

export async function componentRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects/:projectId/components',
        preHandler: requireAuth,
        schema: {
            operationId: 'createComponent',
            tags: ['Components'],
            summary: 'Create a new component for a project',
            params: ProjectResourceParamsSchema,
            body: CreateComponentSchema,
            response: {
                201: ComponentSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content, availableInAllPages, availableInAllEmails, params } =
                request.body;

            const component = await createComponent({
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
                availableInAllPages,
                availableInAllEmails,
                params,
            });

            return reply.status(201).send(component);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/components',
        preHandler: requireAuth,
        schema: {
            operationId: 'listComponents',
            tags: ['Components'],
            summary: 'List all components for a project',
            params: ProjectResourceParamsSchema,
            response: {
                200: ComponentListSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const components = await listComponents({
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(200).send(components);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/components/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'getComponent',
            tags: ['Components'],
            summary: 'Get a component by name for a project',
            params: ComponentParamsSchema,
            response: {
                200: ComponentSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const component = await getComponent({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });
            return reply.status(200).send(component);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'PATCH',
        url: '/projects/:projectId/components/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'updateComponent',
            tags: ['Components'],
            summary: 'Update a component by name for a project',
            params: ComponentParamsSchema,
            body: UpdateComponentSchema,
            response: {
                200: ComponentSchema,
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content, availableInAllPages, availableInAllEmails, params } =
                request.body;

            const component = await updateComponent({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
                availableInAllPages,
                availableInAllEmails,
                params,
            });

            return reply.status(200).send(component);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'DELETE',
        url: '/projects/:projectId/components/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'deleteComponent',
            tags: ['Components'],
            summary: 'Delete a component by name for a project',
            params: ComponentParamsSchema,
            response: {
                204: z.null(),
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            await deleteComponent({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(204).send(null);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects/:projectId/components/upload',
        preHandler: requireAuth,
        schema: {
            operationId: 'uploadComponent',
            tags: ['Components'],
            summary: 'Upload a component for a project',
            consumes: ['multipart/form-data'],
            params: ProjectResourceParamsSchema,
            body: UploadComponentSchema,
            response: {
                201: ComponentSchema,
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { file } = request.body;

            const buffer = await file.toBuffer();
            const content = buffer.toString('utf-8');

            const component = await uploadComponent({
                projectId: request.params.projectId,
                userId: request.user!.id,
                filename: file.filename,
                content,
            });

            return reply.status(201).send(component);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects/:projectId/components/reload',
        preHandler: requireAuth,
        schema: {
            operationId: 'reloadComponents',
            tags: ['Components'],
            summary: 'Reload components.json for a project',
            params: ProjectResourceParamsSchema,
            response: {
                200: ReloadComponentJsonSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            await reloadComponentsJson({
                projectId: request.params.projectId,
                userId: request.user!.id,
            });
            return reply.status(200).send({ message: 'components.json regenerated successfully' });
        },
    });
}
