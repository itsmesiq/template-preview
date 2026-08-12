import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectsTable } from '../db/schema.js';
import { ComponentNotFoundError, ProjectNotFoundError } from '../errors/index.js';

interface GetComponentInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function getComponent({ id, projectId, userId }: GetComponentInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [component] = await db
        .select()
        .from(componentsTable)
        .where(and(eq(componentsTable.id, id), eq(componentsTable.projectId, projectId)))
        .limit(1);

    if (!component) {
        throw new ComponentNotFoundError(id);
    }

    return component;
}
