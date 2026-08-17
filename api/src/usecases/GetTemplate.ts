import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable, templatesTable } from '../db/schema.js';
import { TemplateNotFoundError } from '../errors/index.js';

interface GetTemplateInput {
    id: string;
    projectId: string;
    userId: string;
}

export async function getTemplate({ id, projectId, userId }: GetTemplateInput) {
    const [template] = await db
        .select({
            id: templatesTable.id,
            name: templatesTable.name,
            projectId: templatesTable.projectId,
            content: templatesTable.content,
            createdAt: templatesTable.createdAt,
            updatedAt: templatesTable.updatedAt,
        })
        .from(templatesTable)
        .innerJoin(projectsTable, eq(templatesTable.projectId, projectsTable.id))
        .where(
            and(
                eq(templatesTable.id, id),
                eq(templatesTable.projectId, projectId),
                eq(projectsTable.userId, userId),
            ),
        )
        .limit(1);

    if (!template) {
        throw new TemplateNotFoundError(id);
    }

    return template;
}
