import { describe, expect, test } from '@jest/globals';

import { render } from '../../src/engine/renderer/render.js';

describe('conditions', () => {
    test('empty string is falsy', async () => {
        const html = await render(
            '{{ if value }}YES{{ else }}NO{{ end }}',
            { value: '' },
            new Map(),
        );

        expect(html).toBe('NO');
    });

    test('empty string comparison works', async () => {
        const html = await render(
            '{{ if value != "" }}YES{{ else }}NO{{ end }}',
            { value: '' },
            new Map(),
        );

        expect(html).toBe('NO');
    });

    test('string size comparison works', async () => {
        const html = await render(
            '{{ if value.size == 1 }}YES{{ else }}NO{{ end }}',
            { value: '17' },
            new Map(),
        );

        expect(html).toBe('NO');
    });

    test('string size comparison works when true', async () => {
        const html = await render(
            '{{ if value.size == 1 }}YES{{ else }}NO{{ end }}',
            { value: '7' },
            new Map(),
        );

        expect(html).toBe('YES');
    });

    test('logical AND works', async () => {
        const html = await render(
            '{{ if value && value != "" }}YES{{ else }}NO{{ end }}',
            { value: '' },
            new Map(),
        );

        expect(html).toBe('NO');
    });

    test('if without else works', async () => {
        const html = await render(
            '{{ if value && value != "" }}YES{{ end }}',
            { value: '' },
            new Map(),
        );

        expect(html).toBe('');
    });
});
