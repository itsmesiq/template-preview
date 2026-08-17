import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '../plugins/requireAuth.js';
import {
    CreateProjectSchema,
    ErrorSchema,
    ProjectListSchema,
    ProjectParamsSchema,
    ProjectSchema,
    UpdateProjectSchema,
} from '../schemas/index.js';
import { createProject } from '../usecases/CreateProject.js';
import { deleteProject } from '../usecases/DeleteProject.js';
import { getProject } from '../usecases/GetProject.js';
import { listProjects } from '../usecases/ListProjects.js';
import { updateProject } from '../usecases/UpdateProjects.js';

export async function projectsRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/projects',
        preHandler: requireAuth,
        schema: {
            operationId: 'createProject',
            tags: ['Projects'],
            summary: 'Create a new project',
            body: CreateProjectSchema,
            response: {
                201: ProjectSchema,
                401: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name } = request.body;

            const project = await createProject({
                name,
                userId: request.user!.id,
            });

            return reply.status(201).send(project);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects',
        preHandler: requireAuth,
        schema: {
            operationId: 'listProjects',
            tags: ['Projects'],
            summary: 'List all projects for the authenticated user',
            response: {
                200: ProjectListSchema,
                401: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const projects = await listProjects({
                userId: request.user!.id,
            });

            return reply.status(200).send(projects);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/projects/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'getProject',
            tags: ['Projects'],
            summary: 'Get a project by ID for the authenticated user',
            params: ProjectParamsSchema,
            response: {
                200: ProjectSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const project = await getProject({
                id: request.params.id,
                userId: request.user!.id,
            });

            return reply.status(200).send(project);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'PATCH',
        url: '/projects/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'updateProject',
            tags: ['Projects'],
            summary: 'Update a project by ID for the authenticated user',
            params: ProjectParamsSchema,
            body: UpdateProjectSchema,
            response: {
                200: ProjectSchema,
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            const { name } = request.body;

            const project = await updateProject({
                id: request.params.id,
                userId: request.user!.id,
                name,
            });

            return reply.status(200).send(project);
        },
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'DELETE',
        url: '/projects/:id',
        preHandler: requireAuth,
        schema: {
            operationId: 'deleteProject',
            tags: ['Projects'],
            summary: 'Delete a project by ID for the authenticated user',
            params: ProjectParamsSchema,
            response: {
                204: z.null(),
                401: ErrorSchema,
                404: ErrorSchema,
            },
        },
        handler: async (request, reply) => {
            await deleteProject({
                id: request.params.id,
                userId: request.user!.id,
            });

            return reply.status(204).send(null);
        },
    });
}
