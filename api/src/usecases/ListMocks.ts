import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mocksTable, projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface ListMocksInput {
    projectId: string;
    userId: string;
}

export async function listMocks({ projectId, userId }: ListMocksInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    return db.select().from(mocksTable).where(eq(mocksTable.projectId, projectId));
}
