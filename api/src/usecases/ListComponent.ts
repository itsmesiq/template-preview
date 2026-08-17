import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface ListComponentInput {
    projectId: string;
    userId: string;
}

export async function listComponents({ projectId, userId }: ListComponentInput) {
    const [project] = await db
        .select({ projectId: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    return db.select().from(componentsTable).where(eq(componentsTable.projectId, projectId));
}
