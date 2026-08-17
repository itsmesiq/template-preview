import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable, templatesTable } from '../db/schema.js';
import { ProjectNotFoundError, TemplateNotFoundError } from '../errors/index.js';

interface DeleteTemplateInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function deleteTemplate({ id, projectId, userId }: DeleteTemplateInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [template] = await db
        .delete(templatesTable)
        .where(and(eq(templatesTable.id, id), eq(templatesTable.projectId, projectId)))
        .returning();

    if (!template) {
        throw new TemplateNotFoundError(id);
    }
}
