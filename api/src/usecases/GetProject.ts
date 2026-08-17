import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface GetProjectInput {
    id: string;
    userId: string;
}

export async function getProject({ id, userId }: GetProjectInput) {
    const [project] = await db
        .select()
        .from(projectsTable)
        .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(id);
    }

    return project;
}
