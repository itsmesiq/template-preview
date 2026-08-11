import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface DeleteProjectInput {
    id: string;
    userId: string;
}

export async function deleteProject({ id, userId }: DeleteProjectInput) {
    const [project] = await db
        .delete(projectsTable)
        .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
        .returning();

    if (!project) {
        throw new ProjectNotFoundError(id);
    }
}
