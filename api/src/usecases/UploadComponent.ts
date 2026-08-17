import { createComponent } from './CreateComponent.js';

interface UploadComponentInput {
    projectId: string;
    userId: string;
    filename: string;
    content: string;
}

export async function uploadComponent({
    projectId,
    userId,
    filename,
    content,
}: UploadComponentInput) {
    const name = filename.slice(0, filename.lastIndexOf('.'));

    const component = await createComponent({ projectId, userId, name, content });

    return component;
}
