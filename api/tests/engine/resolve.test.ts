import { describe, expect, test } from '@jest/globals';
import { getRoot, resolve } from '../../src/engine/runtime/resolve';
import { VariableNotFoundError } from '../../src/errors';

describe('resolve', () => {
    test('resolves a simple property', () => {
        const context = {
            name: 'John',
        };

        expect(resolve(context, 'name')).toBe('John');
    });

    test('resolves nested properties', () => {
        const context = {
            user: {
                profile: {
                    name: 'John',
                },
            },
        };

        expect(resolve(context, 'user.profile.name')).toBe('John');
    });

    test('resolves an array item by index', () => {
        const context = {
            texto: ['primeiro', 'segundo'],
        };

        expect(resolve(context, 'texto[1]')).toBe('segundo');
    });

    test('resolves the first item of an array', () => {
        const context = {
            items: ['primeiro', 'segundo'],
        };

        expect(resolve(context, 'items.first')).toBe('primeiro');
    });

    test('resolves the last item of an array', () => {
        const context = {
            items: ['primeiro', 'segundo'],
        };

        expect(resolve(context, 'items.last')).toBe('segundo');
    });

    test('resolves the count of an array', () => {
        const context = {
            items: ['primeiro', 'segundo', 'terceiro'],
        };

        expect(resolve(context, 'items.count')).toBe(3);
    });

    test('resolves the size of a string', () => {
        const context = {
            name: 'Siquir',
        };

        expect(resolve(context, 'name.size')).toBe(6);
    });

    test('returns undefined for an optional missing property', () => {
        const context = {
            user: null,
        };

        expect(resolve(context, 'user?.name')).toBeUndefined();
    });

    test('throws when a required property does not exist', () => {
        const context = {
            user: {
                name: 'John',
            },
        };

        expect(() => resolve(context, 'user.email')).toThrow(
            new VariableNotFoundError('user.email'),
        );
    });

    test('extracts the root variable from a path', () => {
        expect(getRoot('texto[1]')).toBe('texto');
        expect(getRoot('user.profile.name')).toBe('user');
        expect(getRoot('user?.profile?.name')).toBe('user');
    });
});
