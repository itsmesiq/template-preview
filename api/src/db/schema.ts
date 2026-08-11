import { relations } from 'drizzle-orm/_relations';
import { index } from 'drizzle-orm/cockroach-core';
import { boolean, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: text('id').primaryKey(),

    name: text('name').notNull(),

    email: text('email').notNull().unique(),

    emailVerified: boolean('email_verified').default(false).notNull(),

    image: text('image'),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = pgTable(
    'session',
    {
        id: text('id').primaryKey(),

        expiresAt: timestamp('expires_at').notNull(),

        token: text('token').notNull().unique(),

        createdAt: timestamp('created_at').defaultNow().notNull(),

        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),

        ipAddress: text('ip_address'),

        userAgent: text('user_agent'),

        userId: text('user_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'cascade',
            }),
    },
    table => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
    'account',
    {
        id: text('id').primaryKey(),

        accountId: text('account_id').notNull(),

        providerId: text('provider_id').notNull(),

        userId: text('user_id')
            .notNull()
            .references(() => user.id, {
                onDelete: 'cascade',
            }),

        accessToken: text('access_token'),

        refreshToken: text('refresh_token'),

        idToken: text('id_token'),

        accessTokenExpiresAt: timestamp('access_token_expires_at'),

        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

        scope: text('scope'),

        password: text('password'),

        createdAt: timestamp('created_at').defaultNow().notNull(),

        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),
    },
    table => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
    'verification',
    {
        id: text('id').primaryKey(),

        identifier: text('identifier').notNull(),

        value: text('value').notNull(),

        expiresAt: timestamp('expires_at').notNull(),

        createdAt: timestamp('created_at').defaultNow().notNull(),

        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    table => [index('verification_identifier_idx').on(table.identifier)],
);

export const projectsTable = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),

    name: text('name').notNull(),

    userId: text('user_id')
        .notNull()
        .references(() => user.id, {
            onDelete: 'cascade',
        }),

    createdAt: timestamp('created_at').notNull().defaultNow(),

    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const templatesTable = pgTable(
    'templates',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        name: text('name').notNull(),

        projectId: uuid('project_id')
            .notNull()
            .references(() => projectsTable.id, {
                onDelete: 'cascade',
            }),

        content: text('content').notNull(),

        createdAt: timestamp('created_at').notNull().defaultNow(),

        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    table => [unique('templates_project_id_name_unique').on(table.projectId, table.name)],
);

export const componentsTable = pgTable(
    'components',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        name: text('name').notNull(),

        projectId: uuid('project_id')
            .notNull()
            .references(() => projectsTable.id, {
                onDelete: 'cascade',
            }),

        content: text('content').notNull(),

        createdAt: timestamp('created_at').notNull().defaultNow(),

        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    table => [unique('components_project_id_name_unique').on(table.projectId, table.name)],
);

export const mocksTable = pgTable(
    'mocks',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        name: text('name').notNull(),

        projectId: uuid('project_id')
            .notNull()
            .references(() => projectsTable.id, {
                onDelete: 'cascade',
            }),

        content: text('content').notNull(),

        createdAt: timestamp('created_at').notNull().defaultNow(),

        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    table => [unique('mocks_project_id_name_unique').on(table.projectId, table.name)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),

    accounts: many(account),

    projects: many(projectsTable),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],

        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],

        references: [user.id],
    }),
}));

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
    user: one(user, {
        fields: [projectsTable.userId],

        references: [user.id],
    }),

    templates: many(templatesTable),

    components: many(componentsTable),

    mocks: many(mocksTable),
}));

export const templateRelations = relations(templatesTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [templatesTable.projectId],

        references: [projectsTable.id],
    }),
}));

export const componentRelations = relations(componentsTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [componentsTable.projectId],

        references: [projectsTable.id],
    }),
}));

export const mockRelations = relations(mocksTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [mocksTable.projectId],

        references: [projectsTable.id],
    }),
}));
