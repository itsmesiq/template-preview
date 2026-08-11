import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable, templatesTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';

interface ListTemplateInput {
    projectId: string;
    userId: string;
}

export async function listTemplates({ projectId, userId }: ListTemplateInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    return db.select().from(templatesTable).where(eq(templatesTable.projectId, projectId));
}
