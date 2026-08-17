import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mocksTable, projectsTable } from '../db/schema.js';
import { MockNotFoundError, ProjectNotFoundError } from '../errors/index.js';

interface DeleteMockInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function deleteMock({ id, projectId, userId }: DeleteMockInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [mock] = await db
        .delete(mocksTable)
        .where(and(eq(mocksTable.id, id), eq(mocksTable.projectId, projectId)))
        .returning({ id: mocksTable.id });

    if (!mock) {
        throw new MockNotFoundError(id);
    }
}
