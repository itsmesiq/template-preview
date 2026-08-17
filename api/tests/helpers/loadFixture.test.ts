import { describe, expect, test } from '@jest/globals';

import { loadFixture } from './loadFixture.js';

describe('loadFixture', () => {
    test('loads the order-confirmed fixture', async () => {
        const fixture = await loadFixture('order-confirmed');

        expect(fixture.template).toContain('Seu pedido foi confirmado');

        expect(fixture.context).toHaveProperty('pedido.pedido_id', '725391');

        expect(fixture.components.size).toBe(5);
    });

    test('loads component content from fixture files', async () => {
        const fixture = await loadFixture('order-confirmed');

        const productComponent = fixture.components.get('product_full_mail');

        expect(productComponent).toBeDefined();
        expect(productComponent?.name).toBe('product_full_mail');
        expect(productComponent?.params).toEqual([
            {
                name: 'product',
                required: true,
            },
        ]);

        expect(productComponent?.content).toContain('{{ product?.nome }}');
    });

    test('loads components without parameters', async () => {
        const fixture = await loadFixture('order-confirmed');

        const headerComponent = fixture.components.get('header_mail');

        expect(headerComponent).toBeDefined();
        expect(headerComponent?.params).toEqual([]);
    });
});
