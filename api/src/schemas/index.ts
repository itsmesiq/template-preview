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

// Nova versão API

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

export const CreateTemplateSchema = z.object({
    name: z
        .string()
        .min(1, 'Template name is required.')
        .max(100, 'Template name must be less than 100 characters.'),
    content: z.string().default(''),
});

export const UpdateTemplateSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Template name is required.')
            .max(100, 'Template name must be less than 100 characters.')
            .optional(),
        content: z.string().optional(),
    })
    .refine(data => data.name !== undefined || data.content !== undefined, {
        message: 'At least one of name or content must be provided.',
    });

export const TemplateParamsSchema = z.object({
    id: z.uuid(),
    projectId: z.uuid(),
});

export const ProjectResourceParamsSchema = z.object({
    projectId: z.uuid(),
});

export const TemplateSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    projectId: z.uuid(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const TemplateListSchema = z.array(TemplateSchema);

export const ComponentParamSchema = z.object({
    name: z.string().min(1),
    required: z.boolean(),
});

export const ComponentParamsSchema = z.object({
    projectId: z.uuid(),
    id: z.uuid(),
});

export const CreateComponentSchema = z.object({
    name: z.string().min(1).max(100),
    content: z.string().default(''),
    availableInAllPages: z.boolean().default(true),
    availableInAllEmails: z.boolean().default(true),
    params: z.array(ComponentParamSchema).default([]),
});

export const UpdateComponentSchema = z
    .object({
        name: z.string().min(1).max(100).optional(),
        content: z.string().optional(),
        availableInAllPages: z.boolean().optional(),
        availableInAllEmails: z.boolean().optional(),
        params: z.array(ComponentParamSchema).optional(),
    })
    .refine(
        data =>
            data.name !== undefined ||
            data.content !== undefined ||
            data.availableInAllPages !== undefined ||
            data.availableInAllEmails !== undefined ||
            data.params !== undefined,
        {
            message: 'At least one field must be provided',
        },
    );

export const ComponentSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    projectId: z.uuid(),
    content: z.string(),
    availableInAllPages: z.boolean(),
    availableInAllEmails: z.boolean(),
    params: z.array(ComponentParamSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ComponentListSchema = z.array(ComponentSchema);

export const CreateMockSchema = z.object({
    name: z.string().min(1).max(100),
    content: z.string().default(''),
});

export const UpdateMockSchema = z
    .object({
        name: z.string().min(1).max(100).optional(),
        content: z.string().optional(),
    })
    .refine(data => data.name !== undefined || data.content !== undefined, {
        message: 'At least one of name or content must be provided.',
    });

export const MockSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    projectId: z.uuid(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const MockListSchema = z.array(MockSchema);

export const MockParamsSchema = z.object({
    id: z.uuid(),
    projectId: z.uuid(),
});

export { UploadComponentSchema, UploadMockSchema, UploadTemplateSchema } from './uploads.js';
