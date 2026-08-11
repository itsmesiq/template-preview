import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { openAPI } from 'better-auth/plugins';

import { db } from '../db/index.js'; // your drizzle instance
import * as schema from '../db/schema.js'; // your drizzle schema

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', // or "mysql", "sqlite"
        schema,
    }),
    baseURL: process.env.BETTER_AUTH_URL! as string,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID! as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID! as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
        },
    },

    trustedOrigins: [process.env.WEB_APP_BASE_URL! as string],
    plugins: [openAPI()],
});
