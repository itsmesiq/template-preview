import { describe, expect, test } from '@jest/globals';

import { render } from '../../src/engine/renderer/render.js';

describe('local variables', () => {
    test('assigns and reads a local variable', async () => {
        const html = await render('{{~ value = name ~}}{{ value }}', { name: 'John' }, new Map());

        expect(html).toBe('John');
    });

    test('uses an assigned variable in a condition', async () => {
        const html = await render(
            '{{~ value = name ~}}{{ if value }}YES{{ else }}NO{{ end }}',
            { name: 'John' },
            new Map(),
        );

        expect(html).toBe('YES');
    });

    test('empty assigned string is handled by a condition', async () => {
        const html = await render(
            '{{~ value = name ~}}{{ if value && value != "" }}YES{{ else }}NO{{ end }}',
            { name: '' },
            new Map(),
        );

        expect(html).toBe('NO');
    });

    test('assigned string can be piped and indexed', async () => {
        const html = await render(
            '{{~ value = text | string.split "-" ~}}{{ value[1] }}',
            { text: 'A-B' },
            new Map(),
        );

        expect(html).toBe('B');
    });

    test('does not execute assignments inside a false if block', async () => {
        const html = await render(
            `{{~
                if false
                    value = "SHOULD NOT EXIST"
                end
            ~}}
            OK`,
            {},
            new Map(),
        );

        expect(html.trim()).toBe('OK');
    });

    test('executes the else branch when the if condition is false', async () => {
        const html = await render(
            `{{~
                if false
                    value = "WRONG"
                else
                    value = "CORRECT"
                end
            ~}}
            {{ value }}`,
            {},
            new Map(),
        );

        expect(html.trim()).toBe('CORRECT');
    });

    test('executes the if branch when the condition is true', async () => {
        const html = await render(
            `{{~
                if true
                    value = "CORRECT"
                else
                    value = "WRONG"
                end
            ~}}
            {{ value }}`,
            {},
            new Map(),
        );

        expect(html.trim()).toBe('CORRECT');
    });
});
