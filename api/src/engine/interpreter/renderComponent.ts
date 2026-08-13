import { interpret } from '../interpreter/index.js';
import { lexer } from '../parser/lexer.js';
import { parser } from '../parser/parser.js';
import { Runtime } from '../runtime/index.js';
import { evaluateExpression } from './evaluateExpression.js';

export async function renderComponent(
    template: string,
    args: Record<string, string>,
    runtime: Runtime,
): Promise<string> {
    const child = runtime.child();

    for (const [key, expression] of Object.entries(args)) {
        child.set(key, evaluateExpression(expression, runtime));
    }

    const tokens = lexer(template);

    const nodes = parser(tokens);

    return interpret(nodes, child);
}
