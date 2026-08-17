import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';
import { generateComponentsJson } from '../services/ComponentsJson.js';

interface CreateProjectInput {
    name: string;
    userId: string;
}

export async function createProject({ name, userId }: CreateProjectInput) {
    const [project] = await db.insert(projectsTable).values({ name, userId }).returning();

    await generateComponentsJson(project.id);

    return project;
}
