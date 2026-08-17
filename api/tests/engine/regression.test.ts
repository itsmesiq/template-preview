import { describe, expect, test } from '@jest/globals';
import { render } from '../../src/engine/renderer/render.js';
import { loadFixture } from '../helpers/loadFixture.js';

describe('render', () => {
    test('renders the order-confirmed email', async () => {
        const fixture = await loadFixture('order-confirmed');

        const html = await render(fixture.template, fixture.context, fixture.components);

        expect(html).toContain('Seu pedido foi confirmado');
        expect(html).toContain('725391');
        expect(html).toContain('Cliente Exemplo');
        expect(html).toContain('Vestido curto modelo Aurora Verde');
        expect(html).toContain('R$ 349,00');
        expect(html).toContain('1 und.');
        expect(html).toContain('Gateway - Pix');

        expect(html).not.toContain('{{');
        expect(html).not.toContain('}}');
    });

    test('renders the order-confirmed email with split order mock', async () => {
        const fixture = await loadFixture('order-confirmed-split');

        const html = await render(fixture.template, fixture.context, fixture.components);

        expect(html).toContain('Vestido deborah Amarelo');
    });
});
