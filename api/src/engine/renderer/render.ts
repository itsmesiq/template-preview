import type { Component } from '../../types/Component.js';
import type { RenderContext } from '../../types/RenderContext.js';
import { interpret } from '../interpreter/index.js';
import { lexer } from '../parser/lexer.js';
import { parser } from '../parser/parser.js';
import { Runtime } from '../runtime/index.js';

export async function render(
    template: string,
    context: RenderContext,
    components: Map<string, Component>,
) {
    const tokens = lexer(template);

    const nodes = parser(tokens);

    const runtime = new Runtime(context, components);

    return interpret(nodes, runtime);
}
