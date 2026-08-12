import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '../plugins/requireAuth.js';
import {
    CreateMockSchema,
    ErrorSchema,
    MockParamsSchema,
    MockSchema,
    ProjectResourceParamsSchema,
    UpdateMockSchema,
} from '../schemas/index.js';
import { createMock } from '../usecases/CreateMock.js';
import { deleteMock } from '../usecases/DeleteMock.js';
import { getMocks } from '../usecases/GetMocks.js';
import { listMocks } from '../usecases/ListMocks.js';
import { updateMock } from '../usecases/UpdateMock.js';

export async function mocksRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects/:projectId/mocks',
        preHandler: requireAuth,
        schema: {
            operationId: 'createMock',
            tags: ['Mocks'],
            summary: 'Create a new mock for a project',
            params: ProjectResourceParamsSchema,
            body: CreateMockSchema,
            response: {
                201: MockSchema,
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content } = request.body;

            const mock = await createMock({
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
            });

            return reply.status(201).send(mock);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/mocks',
        preHandler: requireAuth,
        schema: {
            operationId: 'listMocks',
            tags: ['Mocks'],
            summary: 'List all mocks for a project',
            params: ProjectResourceParamsSchema,
            response: {
                200: MockSchema.array(),
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const mocks = await listMocks({
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(200).send(mocks);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:projectId/mocks/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'getMock',
            tags: ['Mocks'],
            summary: 'Get a mock by ID for a project',
            params: MockParamsSchema,
            response: {
                200: MockSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const mock = await getMocks({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(200).send(mock);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'PATCH',
        url: '/projects/:projectId/mocks/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'updateMock',
            tags: ['Mocks'],
            summary: 'Update a mock by ID for a project',
            params: MockParamsSchema,
            body: UpdateMockSchema,
            response: {
                200: MockSchema,
                400: ErrorSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name, content } = request.body;

            const mock = await updateMock({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
                name,
                content,
            });

            return reply.status(200).send(mock);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'DELETE',
        url: '/projects/:projectId/mocks/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'deleteMock',
            tags: ['Mocks'],
            summary: 'Delete a mock by ID for a project',
            params: MockParamsSchema,
            response: {
                204: z.null(),
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            await deleteMock({
                id: request.params.id,
                projectId: request.params.projectId,
                userId: request.user!.id,
            });

            return reply.status(204).send(null);
        },
    });
}
