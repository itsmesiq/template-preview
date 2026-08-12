import { createMock } from './CreateMock.js';

interface UploadMockInput {
    projectId: string;
    userId: string;
    filename: string;
    content: string;
}

export async function uploadMock({ projectId, userId, filename, content }: UploadMockInput) {
    const name = filename.slice(0, filename.lastIndexOf('.'));

    return createMock({
        projectId,
        userId,
        name,
        content,
    });
}
