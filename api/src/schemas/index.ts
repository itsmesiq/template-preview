import { z } from 'zod';

export const ErrorSchema = z.object({
    error: z.string(),
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
