import { describe, expect, test } from '@jest/globals';
import { render } from '../../src/engine/renderer/render.js';

describe('optional chaining', () => {
    test('skips the block when an optional value is an empty string', async () => {
        const html = await render(
            `{{~
                texto = product?.atributos
                
                if texto && texto != ""
                    texto = texto | string.split "-"
                    atributos = texto[1] | string.split ","
                end
            ~}}OK`,
            {
                product: {
                    atributos: '',
                },
            },
            new Map(),
        );
        expect(html).toBe('OK');
    });

    test('renders the value when optional property exists', async () => {
        const html = await render(
            `{{~
                texto = product?.atributos
                
                if texto && texto != ""
                    texto = texto | string.split "-"
                    atributos = texto[1] | string.split ","
                end
            ~}}OK`,
            {
                product: {
                    atributos: 'cor - Azul',
                },
            },
            new Map(),
        );

        expect(html).toBe('OK');
    });
});
