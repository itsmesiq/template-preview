import { MultipartFile } from '@fastify/multipart';
import { z } from 'zod';

const UploadFileSchema = z.custom<MultipartFile>(
    value => {
        return (
            typeof value === 'object' &&
            value !== null &&
            'filename' in value &&
            'mimetype' in value &&
            'toBuffer' in value
        );
    },
    {
        message: 'A valid file is required',
    },
);

const UploadJsonFileSchema = UploadFileSchema.superRefine((file, ctx) => {
    if (!file.filename.toLowerCase().endsWith('.json')) {
        ctx.addIssue({
            code: 'custom',
            message: 'File must have a .json extension.',
        });
    }

    if (file.mimetype !== 'application/json') {
        ctx.addIssue({
            code: 'custom',
            message: 'File must have application/json MIME type.',
        });
    }
});

const UploadHtmlFileSchema = UploadFileSchema.superRefine((file, ctx) => {
    if (!file.filename.toLowerCase().endsWith('.html')) {
        ctx.addIssue({
            code: 'custom',
            message: 'File must have a .html extension.',
        });
    }

    if (file.mimetype !== 'text/html') {
        ctx.addIssue({
            code: 'custom',
            message: 'File must have text/html MIME type.',
        });
    }
});

export const UploadMockSchema = z.object({
    file: UploadJsonFileSchema,
});

export const UploadTemplateSchema = z.object({
    file: UploadHtmlFileSchema,
});

export const UploadComponentSchema = z.object({
    file: UploadHtmlFileSchema,
});
