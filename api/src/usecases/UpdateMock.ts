import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mocksTable, projectsTable } from '../db/schema.js';
import { MockNotFoundError, ProjectNotFoundError } from '../errors/index.js';

interface UpdateMockInput {
    id: string;
    projectId: string;
    userId: string;
    name?: string;
    content?: string;
}

export async function updateMock({ id, projectId, userId, name, content }: UpdateMockInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const updateData: {
        name?: string;
        content?: string;
        updatedAt?: Date;
    } = {};

    if (name !== undefined) {
        updateData.name = name;
    }

    if (content !== undefined) {
        updateData.content = content;
    }

    if (name !== undefined || content !== undefined) {
        updateData.updatedAt = new Date();
    }

    const [mock] = await db
        .update(mocksTable)
        .set(updateData)
        .where(and(eq(mocksTable.id, id), eq(mocksTable.projectId, projectId)))
        .returning();

    if (!mock) {
        throw new MockNotFoundError(id);
    }

    return mock;
}
