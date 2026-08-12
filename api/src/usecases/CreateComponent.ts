import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectsTable } from '../db/schema.js';
import { ProjectNotFoundError } from '../errors/index.js';
import { generateComponentsJson } from '../services/ComponentsJson.js';

interface CreateComponentInput {
    projectId: string;
    userId: string;
    name: string;
    content: string;
    availableInAllPages: boolean;
    availableInAllEmails: boolean;
    params: {
        name: string;
        required: boolean;
    }[];
}

export async function createComponent({
    projectId,
    userId,
    name,
    content,
    availableInAllPages,
    availableInAllEmails,
    params,
}: CreateComponentInput) {
    const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
        .limit(1);

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }

    const [component] = await db
        .insert(componentsTable)
        .values({
            name,
            projectId,
            content,
            availableInAllPages,
            availableInAllEmails,
            params,
        })
        .returning();

    await generateComponentsJson(projectId);

    return component;
}
