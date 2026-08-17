import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';
import { generateComponentsJson } from '../services/ComponentsJson.js';

interface ReloadComponentsJsonInput {
    projectId: string;
    userId: string;
}

export async function reloadComponentsJson({ projectId, userId }: ReloadComponentsJsonInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    try {
        await generateComponentsJson(projectId);
    } catch (error) {
        console.error(`Failed to generate components.json for project "${projectId}"`, error);
    }
}
