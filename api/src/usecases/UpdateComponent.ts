import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectsTable } from '../db/schema.js';
import { ComponentNotFoundError, ProjectNotFoundError } from '../errors/index.js';
import { generateComponentsJson } from '../services/ComponentsJson.js';

interface UpdateComponentInput {
    id: string;
    projectId: string;
    userId: string;
    name?: string;
    content?: string;
    availableInAllPages?: boolean;
    availableInAllEmails?: boolean;
    params?: {
        name: string;
        required: boolean;
    }[];
}

export async function updateComponent({
    id,
    projectId,
    userId,
    name,
    content,
    availableInAllPages,
    availableInAllEmails,
    params,
}: UpdateComponentInput) {
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
        availableInAllPages?: boolean;
        availableInAllEmails?: boolean;
        params?: {
            name: string;
            required: boolean;
        }[];
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

    if (availableInAllPages !== undefined) {
        updateData.availableInAllPages = availableInAllPages;
    }

    if (availableInAllEmails !== undefined) {
        updateData.availableInAllEmails = availableInAllEmails;
    }

    if (params !== undefined) {
        updateData.params = params;
    }

    const [component] = await db
        .update(componentsTable)
        .set(updateData)
        .where(and(eq(componentsTable.id, id), eq(componentsTable.projectId, projectId)))
        .returning();

    if (!component) {
        throw new ComponentNotFoundError(id);
    }

    await generateComponentsJson(projectId);

    return component;
}
