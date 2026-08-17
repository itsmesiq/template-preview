import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable, templatesTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface CreateTemplateInput {
    projectId: string;
    userId: string;
    name: string;
    content: string;
}

export async function createTemplate({ projectId, userId, name, content }: CreateTemplateInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [template] = await db
        .insert(templatesTable)
        .values({
            name,
            projectId,
            content,
        })
        .returning();

    return template;
}
