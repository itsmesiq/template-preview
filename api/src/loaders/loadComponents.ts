import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { paths } from '../utils/paths.js';

export interface ComponentConfig {
    name: string;
    path: string;
    params: {
        name: string;
        required: boolean;
    }[];
}

let cache: Map<string, ComponentConfig> | null = null;

export async function loadComponents(): Promise<Map<string, ComponentConfig>> {
    if (cache) {
        return cache;
    }

    const file = await readFile(
        path.join(paths.root, 'templates', 'Config', 'components.json'),
        'utf-8',
    );

    const json = JSON.parse(file) as ComponentConfig[];

    cache = new Map(
        json.map(component => [
            component.name,
            {
                ...component,
                path: path.join('Components', path.basename(component.path)),
            },
        ]),
    );

    return cache;
}
