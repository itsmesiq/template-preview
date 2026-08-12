import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mocksTable, projectsTable } from '../db/schema.js';
import { MockNotFoundError, ProjectNotFoundError } from '../errors/index.js';

interface GetMocksInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function getMocks({ id, projectId, userId }: GetMocksInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [mock] = await db
        .select()
        .from(mocksTable)
        .where(and(eq(mocksTable.id, id), eq(mocksTable.projectId, projectId)))
        .limit(1);

    if (!mock) {
        throw new MockNotFoundError(id);
    }

    return mock;
}
