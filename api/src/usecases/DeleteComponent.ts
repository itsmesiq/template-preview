import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectsTable } from '../db/schema.js';
import { ComponentNotFoundError, ProjectNotFoundError } from '../errors/index.js';
import { generateComponentsJson } from '../services/ComponentsJson.js';

interface DeleteComponentInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function deleteComponent({ id, projectId, userId }: DeleteComponentInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [component] = await db
        .delete(componentsTable)
        .where(and(eq(componentsTable.id, id), eq(componentsTable.projectId, projectId)))
        .returning({ id: componentsTable.id });

    if (!component) {
        throw new ComponentNotFoundError(id);
    }

    try {
        await generateComponentsJson(projectId);
    } catch (error) {
        console.error(`Failed to generate components.json for project "${projectId}"`, error);
    }
}
