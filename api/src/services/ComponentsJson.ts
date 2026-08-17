import { and, eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { componentsTable, projectArtifactsTable } from '../db/schema.js';

export async function generateComponentsJson(projectId: string) {
    const components = await db
        .select({
            name: componentsTable.name,
            params: componentsTable.params,
            availableInAllPages: componentsTable.availableInAllPages,
            availableInAllEmails: componentsTable.availableInAllEmails,
        })
        .from(componentsTable)
        .where(eq(componentsTable.projectId, projectId));

    const content = JSON.stringify(
        components.map(component => ({
            name: component.name,
            path: `components/${component.name}.html`,
            params: component.params,
            availableInAllPages: component.availableInAllPages,
            availableInAllEmails: component.availableInAllEmails,
        })),
        null,
        4,
    );

    const [artifact] = await db
        .select({
            id: projectArtifactsTable.id,
        })
        .from(projectArtifactsTable)
        .where(
            and(
                eq(projectArtifactsTable.projectId, projectId),
                eq(projectArtifactsTable.name, 'components.json'),
            ),
        )
        .limit(1);

    if (artifact) {
        const [updatedArtifact] = await db
            .update(projectArtifactsTable)
            .set({
                content,
                updatedAt: new Date(),
            })
            .where(eq(projectArtifactsTable.id, artifact.id))
            .returning();

        return updatedArtifact;
    }

    const [createdArtifact] = await db
        .insert(projectArtifactsTable)
        .values({
            name: 'components.json',
            projectId,
            content,
        })
        .returning();

    return createdArtifact;
}
