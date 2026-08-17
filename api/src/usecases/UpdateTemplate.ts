import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable, templatesTable } from '../db/schema.js';
import { ProjectNotFoundError, TemplateNotFoundError } from '../errors/index.js';

interface UpdateTemplateInput {
    id: string;
    projectId: string;
    userId: string;
    name?: string;
    content?: string;
}

export async function updateTemplate({
    id,
    projectId,
    userId,
    name,
    content,
}: UpdateTemplateInput) {
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
        updatedAt: Date;
    } = {
        updatedAt: new Date(),
    };

    if (name !== undefined) {
        updateData.name = name;
    }

    if (content !== undefined) {
        updateData.content = content;
    }

    const [template] = await db
        .update(templatesTable)
        .set(updateData)
        .where(and(eq(templatesTable.id, id), eq(templatesTable.projectId, projectId)))
        .returning();

    if (!template) {
        throw new TemplateNotFoundError(id);
    }

    return template;
}
