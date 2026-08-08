import { z } from 'zod';

export const PreviewParamsSchema = z.object({
    template: z.string(),
});

export const PreviewQuerySchema = z.object({
    mock: z.string().default('default'),
});
