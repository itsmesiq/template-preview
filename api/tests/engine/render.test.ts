import { describe, expect, test } from '@jest/globals';
import { render } from '../../src/engine/renderer/render.js';

describe('render', () => {
    test('renders a simple variable', async () => {
        const html = await render(
            '{{ name }}',
            {
                name: 'John',
            },
            new Map(),
        );

        expect(html).toBe('John');
    });

    test('renders an array item using bracket notation', async () => {
        const html = await render(
            '{{ texto[1] }}',
            {
                texto: ['primeiro', 'segundo'],
            },
            new Map(),
        );

        expect(html).toBe('segundo');
    });

    test('renders values inside a for loop', async () => {
        const html = await render(
            '{{ for item in items }}{{ item }}{{ end }}',
            {
                items: ['A', 'B', 'C'],
            },
            new Map(),
        );

        expect(html).toBe('ABC');
    });

    test('renders a component using an argument from the context', async () => {
        const components = new Map([
            [
                'Greeting',
                {
                    name: 'Greeting',
                    content: 'Hello {{ name }}',
                    params: [],
                },
            ],
        ]);

        const html = await render(
            '{{ Greeting name: user.name }}',
            {
                user: {
                    name: 'John',
                },
            },
            components,
        );

        expect(html).toBe('Hello John');
    });

    test('keeps access to the context inside a loop', async () => {
        const html = await render(
            '{{ name }}{{ for item in items }}{{ name }}{{ end }}',
            {
                name: 'John',
                items: ['A', 'B'],
            },
            new Map(),
        );

        expect(html).toBe('JohnJohnJohn');
    });

    test('component can access the context', async () => {
        const components = new Map([
            [
                'Greeting',
                {
                    name: 'Greeting',
                    content: 'Hello {{ user.name }}',
                    params: [],
                },
            ],
        ]);

        const html = await render(
            '{{ Greeting }}',
            {
                user: {
                    name: 'John',
                },
            },
            components,
        );

        expect(html).toBe('Hello John');
    });

    test('renders nested components', async () => {
        const components = new Map([
            [
                'Greeting',
                {
                    name: 'Greeting',
                    content: 'Hello {{ name }}',
                    params: [],
                },
            ],
            [
                'Card',
                {
                    name: 'Card',
                    content: '<div>{{ Greeting name: user.name }}</div>',
                    params: [],
                },
            ],
        ]);

        const html = await render(
            '{{ Card }}',
            {
                user: {
                    name: 'John',
                },
            },
            components,
        );

        expect(html).toBe('<div>Hello John</div>');
    });
});
