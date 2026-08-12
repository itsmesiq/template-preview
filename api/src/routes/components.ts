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
    UpdateComponentSchema,
} from '../schemas/index.js';
import { createComponent } from '../usecases/CreateComponent.js';
import { deleteComponent } from '../usecases/DeleteComponents.js';
import { getComponent } from '../usecases/GetComponent.js';
import { listComponents } from '../usecases/ListComponent.js';
import { updateComponent } from '../usecases/UpdateComponent.js';

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
}
