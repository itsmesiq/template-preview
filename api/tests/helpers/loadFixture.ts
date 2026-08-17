import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Component } from '../../src/types/Component.js';
import type { RenderContext } from '../../src/types/RenderContext.js';

const FIXTURES_DIR = path.resolve('tests/fixtures');

interface ComponentFixture {
    name: string;
    contentFile: string;
    params: Component['params'];
}

export interface Fixture {
    template: string;
    context: RenderContext;
    components: Map<string, Component>;
}

export async function loadFixture(name: string): Promise<Fixture> {
    const fixtureDir = path.join(FIXTURES_DIR, name);

    const template = await readFile(path.join(fixtureDir, 'order_confirmed.html'), 'utf-8');

    const contextContent = await readFile(path.join(fixtureDir, 'context.json'), 'utf-8');

    const context = JSON.parse(contextContent) as RenderContext;

    const componentsContent = await readFile(path.join(fixtureDir, 'components.json'), 'utf-8');

    const componentFixtures = JSON.parse(componentsContent) as ComponentFixture[];

    const components = new Map<string, Component>();

    for (const componentFixture of componentFixtures) {
        const content = await readFile(
            path.join(fixtureDir, componentFixture.contentFile),
            'utf-8',
        );

        components.set(componentFixture.name, {
            name: componentFixture.name,
            content,
            params: componentFixture.params,
        });
    }

    return {
        template,
        context,
        components,
    };
}
