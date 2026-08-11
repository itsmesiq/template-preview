import { z } from 'zod';

export const ErrorSchema = z.object({
    error: z.string(),
    message: z.string(),
    code: z.string(),
});

export const PreviewParamsSchema = z.object({
    template: z.string(),
});

export const PreviewQuerySchema = z.object({
    mock: z.string().default('default'),
});

export const MocksResponseSchema = z.array(z.string());

export const TemplatesResponseSchema = z.array(z.string());

export const VersionResponseSchema = z.object({
    version: z.number(),
});

export const CreateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Project name is required.')
        .max(100, 'Project name must be less than 100 characters.'),
});

export const ProjectSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ProjectListSchema = z.array(ProjectSchema);

export const ProjectParamsSchema = z.object({
    id: z.uuid(),
});

export const UpdateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Project name is required.')
        .max(100, 'Project name must be less than 100 characters.'),
});
