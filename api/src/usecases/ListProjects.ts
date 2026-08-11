import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { projectsTable } from '../db/schema.js';

interface ListProjectsInput {
    userId: string;
}

export async function listProjects({ userId }: ListProjectsInput) {
    return db.select().from(projectsTable).where(eq(projectsTable.userId, userId));
}
