import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z
        .string()
        .refine(value => value.startsWith('postgresql://') || value.startsWith('postgres://')),
    BETTER_AUTH_SECRET: z.string(),
    API_BASE_URL: z.url().default('http://localhost:3000'),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    WEB_APP_BASE_URL: z.url().default('http://localhost:3001'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
