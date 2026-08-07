import { interpret } from "../interpreter/index.js";
import { lexer } from "../parser/lexer.js";
import { parser } from "../parser/parser.js";
import { Runtime } from "../runtime/index.js";
import { loadTemplate } from "./loadTemplate.js";

export async function render(template: string, context: Record<string, unknown>,) {
    const html = await loadTemplate(template);

    const tokens = lexer(html);

    const nodes = parser(tokens);

    const runtime = new Runtime(context);

    return interpret(nodes, runtime);
}