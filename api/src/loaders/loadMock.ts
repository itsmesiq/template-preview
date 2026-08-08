import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { MockNotFoundError } from '../errors/index.js';
import { paths } from '../utils/paths.js';

export async function loadMock(name: string): Promise<unknown> {
    const file = path.join(paths.mock, `${name}.json`);

    try {
        const json = await readFile(file, 'utf-8');
        return JSON.parse(json);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            throw new MockNotFoundError(name);
        }
        throw error;
    }
}
