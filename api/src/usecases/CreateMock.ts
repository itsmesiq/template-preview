import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mocksTable, projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface CreateMockInput {
    projectId: string;
    userId: string;
    name: string;
    content: string;
}

export async function createMock({ projectId, userId, name, content }: CreateMockInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [mock] = await db
        .insert(mocksTable)
        .values({
            name,
            projectId,
            content,
        })
        .returning();

    return mock;
}
