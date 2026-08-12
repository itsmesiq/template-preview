import { createTemplate } from './CreateTemplate.js';

interface UploadTemplateUseCase {
    projectId: string;
    userId: string;
    filename: string;
    content: string;
}

export async function uploadTemplate({
    projectId,
    userId,
    filename,
    content,
}: UploadTemplateUseCase) {
    const name = filename.slice(0, filename.lastIndexOf('.'));

    return createTemplate({ projectId, userId, name, content });
}
