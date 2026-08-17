import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface UpdateProjectInput {
    id: string;
    userId: string;
    name: string;
}

export async function updateProject({ id, userId, name }: UpdateProjectInput) {
    const [project] = await db
        .update(projectsTable)
        .set({ name, updatedAt: new Date() })
        .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
        .returning();

    if (!project) {
        throw new ProjectNotFoundError(id);
    }

    return project;
}
