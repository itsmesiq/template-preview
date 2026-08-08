import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { TemplateNotFoundError } from '../../errors/index.js';
import { paths } from '../../utils/paths.js';

export async function loadTemplate(name: string): Promise<string> {
    const file = path.join(paths.templates, `${name}.html`);

    try {
        return await readFile(file, 'utf-8');
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            throw new TemplateNotFoundError(name);
        }
        throw error;
    }
}
