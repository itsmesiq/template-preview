import { describe, expect, test } from '@jest/globals';
import { Runtime } from '../../src/engine/runtime/index.js';

describe('Runtime', () => {
    test('resolves values from the context', () => {
        const runtime = new Runtime(
            {
                user: {
                    name: 'John',
                },
            },
            new Map(),
        );

        expect(runtime.get('user.name')).toBe('John');
    });

    test('resolves array indezes from the context', () => {
        const runtime = new Runtime(
            {
                texto: ['primeiro', 'segundo'],
            },
            new Map(),
        );

        expect(runtime.get('texto[1]')).toBe('segundo');
    });

    test('resolves local variables', () => {
        const runtime = new Runtime({}, new Map());

        runtime.set('name', 'John');

        expect(runtime.get('name')).toBe('John');
    });

    test('local variables override context values', () => {
        const runtime = new Runtime(
            {
                name: 'context',
            },
            new Map(),
        );

        runtime.set('name', 'local');
        expect(runtime.get('name')).toBe('local');
    });

    test('child runtime keeps access to the context', () => {
        const runtime = new Runtime(
            {
                user: {
                    name: 'John',
                },
            },
            new Map(),
        );

        const child = runtime.child();
        expect(child.get('user.name')).toBe('John');
    });

    test('child runtime inherits parent local variables', () => {
        const runtime = new Runtime({}, new Map());

        runtime.set('name', 'John');

        const child = runtime.child();

        expect(child.get('name')).toBe('John');
    });

    test('child runtime can override a parent local variable', () => {
        const runtime = new Runtime({}, new Map());

        runtime.set('name', 'parent');

        const child = runtime.child();
        child.set('name', 'child');

        expect(child.get('name')).toBe('child');
        expect(runtime.get('name')).toBe('parent');
    });

    test('resolves registered components', () => {
        const button = {
            name: 'Button',
            content: '<button>{{ text }}</button>',
            params: [],
        };
        const runtime = new Runtime({}, new Map([['Button', button]]));

        expect(runtime.getComponent('Button')).toEqual(button);
    });

    test('returns undefined for an unknown component', () => {
        const runtime = new Runtime({}, new Map());

        expect(runtime.getComponent('Unknown')).toBeUndefined();
    });
});
